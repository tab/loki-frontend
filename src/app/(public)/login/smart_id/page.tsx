"use client"

import React, { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Formik, Form } from "formik"
import { Alert, Box, Typography } from "@mui/material"
import { v7 as uuid } from "uuid"

import i18n from "@/config/i18n"
import { PERSONAL_CODE_LENGTH, PERSONAL_CODE_REGEX } from "@/lib/helpers/personal_code"
import { axiosInstance } from "@/lib/axios"
import Card from "@/components/ui/Card"
import Input from "@/components/ui/Input"
import Select from "@/components/ui/Select"
import Submit from "@/components/ui/Submit"
import Polling from "@/components/Polling"
import { SessionType } from "@/types/session"

interface FormValues {
  country: string
  personal_code: string
}

const COUNTRIES = [
  { label: i18n.t("pages.login.countries.ee"), value: "EE" },
  { label: i18n.t("pages.login.countries.lv"), value: "LV" },
  { label: i18n.t("pages.login.countries.lt"), value: "LT" },
  { label: i18n.t("pages.login.countries.be"), value: "BE" },
]

const initialValues = {
  country: "EE",
  personal_code: "40504040001",
}

export default function SmartIdPage() {
  const [traceId] = useState<string>(uuid())
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [verificationCode, setVerificationCode] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  const createSmartIdSession = useMutation({
    mutationFn: async (values: FormValues) => {
      const { data } = await axiosInstance.post<SessionType>("/auth/smart_id", values, {
        headers: {
          'X-Trace-ID': traceId
        }
      })
      return data
    },
    onSuccess: (session: SessionType) => {
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
    const errors = {} as { personal_code?: string }
    if (!values.personal_code) {
      errors.personal_code = i18n.t("validation.field.required", { field: i18n.t("personal_code.title") })
    } else if (!PERSONAL_CODE_REGEX.test(values.personal_code)) {
      errors.personal_code = i18n.t("validation.field.invalid", { field: i18n.t("personal_code.title") })
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
          {i18n.t("pages.login.providers.smart_id")}
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
              createSmartIdSession.mutate(values, {
                onSettled: () => {
                  setSubmitting(false)
                },
              })
            }}
          >
            {({ handleChange, handleBlur, values, errors, touched, isSubmitting }) => (
              <Form>
                <Select
                  label="Country"
                  name="country"
                  value={values.country}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.country && Boolean(errors.country)}
                  helperText={touched.country && errors.country ? errors.country : ""}
                  options={COUNTRIES}
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
