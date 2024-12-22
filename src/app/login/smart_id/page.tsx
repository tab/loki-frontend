"use client"

import { useState } from "react"
import { Formik, Form, Field } from "formik"
import { v7 as uuid } from "uuid"
import i18n from "@/config/i18n"
import { PERSONAL_CODE_LENGTH, PERSONAL_CODE_REGEX } from "@/helpers/personal_code"
import Input from "@/components/ui/Input"
import Submit from "@/components/ui/Submit"
import FlashMessage from "@/components/ui/FlashMessage"
import Polling from "@/components/Polling"
import styles from "./page.module.css"

const COUNTRIES = ["EE", "LV", "LT", "BE"]

export default function SmartIdLogin() {
  const [traceId] = useState<string>(uuid())
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [verificationCode, setVerificationCode] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const initialValues = {
    country: "EE",
    personal_code: "50001029996",
  }

  const handleValidate = (values: { personal_code: string; country: string }) => {
    const errors = {} as { personal_code?: string }
    if (!values.personal_code) {
      errors.personal_code = i18n.t("validation.field.required", { field: i18n.t("personal_code.title") })
    } else if (values.personal_code.length !== PERSONAL_CODE_LENGTH) {
      errors.personal_code = i18n.t("validation.field.invalid", { field: i18n.t("personal_code.title") })
    } else if (!PERSONAL_CODE_REGEX.test(values.personal_code)) {
      errors.personal_code = i18n.t("validation.field.invalid", { field: i18n.t("personal_code.title") })
    }

    return errors
  }

  const handleSubmit = async (values: { personal_code: string; country: string }, setSubmitting: (isSubmitting: boolean) => void) => {
    setErrorMessage(null)

    try {
      const response = await fetch(`/api/auth/smart_id`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Trace-ID": traceId,
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrorMessage(data.error || i18n.t("errors.unexpected_error"))
        return
      }


      setSessionId(data.id)
      setVerificationCode(data.code)
    } catch (error: any) {
      setErrorMessage(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h5>{i18n.t("pages.login.providers.smart_id")}</h5>
      {errorMessage && <FlashMessage message={errorMessage} type="error" />}

      {sessionId && verificationCode ? (
        <div className={styles.resultContainer}>
          <progress />
          <p>{i18n.t("pages.login.verification.code")}: {verificationCode}</p>
          <Polling traceId={traceId} sessionId={sessionId} />
        </div>
      ) : (
        <Formik
          initialValues={initialValues}
          validate={(values) => handleValidate(values)}
          onSubmit={(values, { setSubmitting }) => handleSubmit(values, setSubmitting)}
        >
          {({ isSubmitting }) => (
            <Form className={styles.form}>
              <Field as="select" name="country">
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Field>
              <Input
                type="text"
                name="personal_code"
                placeholder={i18n.t("personal_code.form.placeholder")}
                autoComplete="off"
              />
              <Submit isSubmitting={isSubmitting}>
                {i18n.t("pages.login.form.submit")}
              </Submit>
            </Form>
          )}
        </Formik>
      )}
    </div>
  )
}
