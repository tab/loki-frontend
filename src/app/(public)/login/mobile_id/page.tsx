"use client"

import React, { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Formik, Form } from "formik"
import { Alert, Box, Typography } from "@mui/material"
import { v7 as uuid } from "uuid"

import i18n from "@/config/i18n"
import { PERSONAL_CODE_LENGTH, PERSONAL_CODE_REGEX } from "@/lib/helpers/personal_code"
import { PHONE_NUMBER_LENGTH, PHONE_NUMBER_REGEX } from "@/lib/helpers/phone_number"
import { axiosInstance } from "@/lib/axios"
import Card from "@/components/ui/Card"
import Input from "@/components/ui/Input"
import Select from "@/components/ui/Select"
import Submit from "@/components/ui/Submit"
import Polling from "@/components/Polling"
import { SessionType } from "@/types/session"

interface FormValues {
  locale: string
  personal_code: string
  phone_number: string
}

const LOCALES = [
  { label: i18n.t("pages.login.locales.en"), value: "ENG" },
  { label: i18n.t("pages.login.locales.ee"), value: "EST" },
  { label: i18n.t("pages.login.locales.ru"), value: "RUS" },
]

const initialValues = {
  locale: "ENG",
  personal_code: "60001017869",
  phone_number: "+37268000769"
}

export default function MobileIdPage() {
  const [traceId] = useState<string>(uuid())
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [verificationCode, setVerificationCode] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  const createMobileIdSession = useMutation({
    mutationFn: async (values: FormValues) => {
      const { data } = await axiosInstance.post<SessionType>("/auth/mobile_id", values, {
        headers: {
          'X-Trace-ID': traceId
        }
      })
      return data
    },
    onSuccess: (session: SessionType, variables) => {
      setApiError(null)
      setSessionId(session.id)
      setVerificationCode(session.code)
    },
    onError: error => {
      setApiError(i18n.t("errors.unexpected_error"))
      console.error(error)
    },
  })

  const handleValidate = (values: FormValues) => {
    const errors = {} as { personal_code?: string; phone_number?: string }
    if (!values.personal_code) {
      errors.personal_code = i18n.t("validation.field.required", { field: i18n.t("personal_code.title") })
    } else if (values.personal_code.length !== PERSONAL_CODE_LENGTH) {
      errors.personal_code = i18n.t("validation.field.invalid", { field: i18n.t("personal_code.title") })
    } else if (!PERSONAL_CODE_REGEX.test(values.personal_code)) {
      errors.personal_code = i18n.t("validation.field.invalid", { field: i18n.t("personal_code.title") })
    }

    if (!values.phone_number) {
      errors.phone_number = i18n.t("validation.field.required", { field: i18n.t("phone_number.title") })
    } else if (values.phone_number.length !== PHONE_NUMBER_LENGTH) {
      errors.phone_number = i18n.t("validation.field.invalid", { field: i18n.t("phone_number.title") })
    } else if (!PHONE_NUMBER_REGEX.test(values.phone_number)) {
      errors.phone_number = i18n.t("validation.field.invalid", { field: i18n.t("phone_number.title") })
    }

    return errors
  }

  return (
    <Box
      sx={{ minHeight: "100vh" }}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="50vh"
      bgcolor="background.default"
      color="text.primary"
    >
      <Card sx={{ padding: 4, maxWidth: 420, width: '100%' }}>
        <Typography variant="h5" gutterBottom align="center">
          {i18n.t("pages.login.providers.mobile_id")}
        </Typography>

        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {apiError}
          </Alert>
        )}

        {sessionId && traceId ? (
          <>
            {verificationCode && (
              <Typography variant="h6" gutterBottom align="center">
                {i18n.t("pages.login.verification.code")}: {verificationCode}
              </Typography>
            )}
            <Polling traceId={traceId} sessionId={sessionId} />
          </>
        ) : (
          <Formik
            initialValues={initialValues}
            validate={(values: FormValues) => handleValidate(values)}
            onSubmit={(values: FormValues, { setSubmitting }) => {
              createMobileIdSession.mutate(values, {
                onSettled: () => {
                  setSubmitting(false)
                },
              })
            }}
          >
            {({ handleChange, handleBlur, values, errors, touched, isSubmitting }) => (
              <Form>
                <Select
                  label="Locale"
                  name="locale"
                  value={values.locale}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.locale && Boolean(errors.locale)}
                  helperText={touched.locale && errors.locale ? errors.locale : ""}
                  options={LOCALES}
                />

                <Input
                  name="personal_code"
                  label={i18n.t("personal_code.title")}
                  value={values.personal_code}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.personal_code && Boolean(errors.personal_code)}
                  helperText={touched.personal_code && errors.personal_code ? errors.personal_code : ""}
                />

                <Input
                  type="tel"
                  name="phone_number"
                  label={i18n.t("phone_number.title")}
                  value={values.phone_number}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.phone_number && Boolean(errors.phone_number)}
                  helperText={touched.phone_number && errors.phone_number ? errors.phone_number : ""}
                />

                <Box mt={2} display="flex" justifyContent="center">
                  <Submit disabled={isSubmitting}>
                    {isSubmitting ? i18n.t("common.loading") : i18n.t("pages.login.form.submit")}
                  </Submit>
                </Box>
              </Form>
            )}
          </Formik>
        )}
      </Card>
    </Box>
  )
}
