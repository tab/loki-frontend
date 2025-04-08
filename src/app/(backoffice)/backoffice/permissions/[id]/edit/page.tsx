"use client"

import React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { useSnackbar } from "notistack"
import { Formik, Form } from "formik"
import { Button, Box } from "@mui/material"

import i18n from "@/config/i18n"
import { axiosBackofficeInstance as axiosInstance } from "@/lib/axios"
import Title from "@/components/ui/Title"
import Card from "@/components/ui/Card"
import Input from "@/components/ui/Input"
import Loader from "@/components/ui/Loader"
import LoaderError from "@/components/ui/Error"
import { PermissionType } from "@/types/permission"
import Link from "next/link"

interface FormValues {
  name: string
  description: string
}

export default function EditPermissionPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const params = useParams()
  const { enqueueSnackbar } = useSnackbar()

  const { id } = params

  const { data, isLoading, isError } = useQuery<PermissionType>({
    queryKey: ["permission", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/backoffice/permissions/${id}`)
      return data
    },
    enabled: !!id,
  })

  const updateMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const { data } = await axiosInstance.put(`/backoffice/permissions/${id}`, values)
      return data
    },
    onSuccess: () => {
      // @ts-ignore
      queryClient.invalidateQueries(["permissions"])
      enqueueSnackbar(i18n.t("permission.snackbar.update.success"), { variant: "default" })
      router.push("/backoffice/permissions")
    },
    onError: error => {
      enqueueSnackbar(i18n.t("permission.snackbar.update.error"), { variant: "default" })
      console.error(error)
    },
  })

  const handleValidate = (values: FormValues) => {
    const errors = {} as { name?: string; description?: string; }
    if (!values.name) {
      errors.name = i18n.t("validation.field.required", { field: i18n.t("name.title") })
    }
    if (!values.description) {
      errors.description = i18n.t("validation.field.required", { field: i18n.t("description.title") })
    }

    return errors
  }

  if (isLoading) { return <Loader /> }
  if (isError || !data) { return <LoaderError />}

  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Title>
          {i18n.t("pages.backoffice.permissions.edit.title", { name: data.name })}
        </Title>
      </Box>

      <Card
        sx={{ p: 2 }}
      >
        <Formik
          initialValues={{ name: data.name, description: data.description }}
          validate={(values: FormValues) => handleValidate(values)}
          onSubmit={(values: FormValues, { setSubmitting }) => {
            updateMutation.mutate(values, {
              onSettled: () => {
                setSubmitting(false)
              },
            })
          }}
        >
          {({ handleChange, handleBlur, values, errors, touched, isSubmitting }) => (
            <Form>
              <Input
                name="name"
                label={i18n.t("permission.form.name.title")}
                placeholder={i18n.t("permission.form.name.placeholder")}
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name ? errors.name : ""}
              />
              <Input
                name="description"
                label={i18n.t("permission.form.description.title")}
                placeholder={i18n.t("permission.form.description.placeholder")}
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description ? errors.description : ""}
              />

              <Box mt={1} display="flex" justifyContent="flex-start">
                <Button sx={{ mr: 1 }} type="submit" variant="contained" disabled={isSubmitting}>
                  {i18n.t("common.submit")}
                </Button>
                <Link href="/backoffice/permissions">
                  <Button variant="outlined">
                    {i18n.t("common.back")}
                  </Button>
                </Link>
              </Box>
            </Form>
          )}
        </Formik>
      </Card>
    </>
  )
}
