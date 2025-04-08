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
import CheckboxGroup from "@/components/ui/CheckboxGroup"
import Loader from "@/components/ui/Loader"
import LoaderError from "@/components/ui/Error"
import Link from "next/link"
import { PaginatedPermissionsType, PermissionType } from "@/types/permission"
import { RoleType } from "@/types/role"

interface FormValues {
  name: string
  description: string
  permission_ids: string[]
}

export default function EditRolePage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const params = useParams()
  const { enqueueSnackbar } = useSnackbar()

  const { id } = params

  const { data, isLoading, isError } = useQuery<RoleType>({
    queryKey: ["role", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/backoffice/roles/${id}`)
      return data
    },
    enabled: !!id,
  })

  const {
    data: permissions,
    isLoading: isPermissionsLoading,
    isError: isPermissionsError,
  } = useQuery<PaginatedPermissionsType>({
    queryKey: ["permissions", 1, 1000],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/backoffice/permissions", {
        params: {
          page: 1,
          per: 1000,
        },
      })
      return data
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const { data } = await axiosInstance.put(`/backoffice/roles/${id}`, values)
      return data
    },
    onSuccess: () => {
      // @ts-ignore
      queryClient.invalidateQueries(["roles"])
      enqueueSnackbar(i18n.t("role.snackbar.update.success"), { variant: "default" })
      router.push("/backoffice/roles")
    },
    onError: error => {
      enqueueSnackbar(i18n.t("role.snackbar.update.error"), { variant: "default" })
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

  const isFetching = isLoading || isPermissionsLoading
  const isErrorFetching = isError || isPermissionsError || !data || !permissions

  if (isFetching) { return <Loader /> }
  if (isErrorFetching) { return <LoaderError />}

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
          {i18n.t("pages.backoffice.roles.edit.title", { name: data.name })}
        </Title>
      </Box>

      <Card
        sx={{ p: 2 }}
      >
        <Formik
          initialValues={{
            name: data.name,
            description: data.description,
            permission_ids: data.permission_ids || [],
          }}
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
                label={i18n.t("role.form.name.title")}
                placeholder={i18n.t("role.form.name.placeholder")}
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name ? errors.name : ""}
              />
              <Input
                name="description"
                label={i18n.t("role.form.description.title")}
                placeholder={i18n.t("role.form.description.placeholder")}
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description ? errors.description : ""}
              />
              <CheckboxGroup
                name="permission_ids"
                label={i18n.t("role.form.permissions.title")}
                options={permissions.data.map(
                  (permission: PermissionType) => ({
                    label: permission.name,
                    value: permission.id,
                  })
                )}
                values={values.permission_ids}
                onChange={handleChange}
              />

              <Box mt={1} display="flex" justifyContent="flex-start">
                <Button sx={{ mr: 1 }} type="submit" variant="contained" disabled={isSubmitting}>
                  {i18n.t("common.submit")}
                </Button>
                <Link href="/backoffice/roles">
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
