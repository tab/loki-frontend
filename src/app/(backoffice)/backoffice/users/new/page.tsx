"use client"

import React from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useSnackbar } from "notistack"
import { Formik, Form } from "formik"
import { Button, Box } from "@mui/material"
import Link from "next/link"

import i18n from "@/config/i18n"
import { axiosBackofficeInstance as axiosInstance } from "@/lib/axios"
import Title from "@/components/ui/Title"
import Card from "@/components/ui/Card"
import Input from "@/components/ui/Input"
import { PaginatedRolesType, RoleType } from "@/types/role"
import { PaginatedScopesType, ScopeType } from "@/types/scope"
import Loader from "@/components/ui/Loader"
import LoaderError from "@/components/ui/Error"
import CheckboxGroup from "@/components/ui/CheckboxGroup"

interface FormValues {
  identity_number: string
  personal_code: string
  first_name: string
  last_name: string
  role_ids: string[]
  scope_ids: string[]
}

const initialValues = {
  identity_number: "",
  personal_code: "",
  first_name: "",
  last_name: "",
  role_ids: [],
  scope_ids: [],
}

export default function NewUserPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()

  const {
    data: roles,
    isLoading: isRolesLoading,
    isError: isRolesError,
  } = useQuery<PaginatedRolesType>({
    queryKey: ["roles", 1, 1000],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/backoffice/roles", {
        params: {
          page: 1,
          per: 1000,
        },
      })
      return data
    },
  })

  const {
    data: scopes,
    isLoading: isScopesLoading,
    isError: isScopesError,
  } = useQuery<PaginatedScopesType>({
    queryKey: ["scopes", 1, 1000],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/backoffice/scopes", {
        params: {
          page: 1,
          per: 1000,
        },
      })
      return data
    },
  })

  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const { data } = await axiosInstance.post("/backoffice/users", values)
      return data
    },
    onSuccess: () => {
      // @ts-ignore
      queryClient.invalidateQueries(["users"])
      enqueueSnackbar(i18n.t("user.snackbar.create.success"), { variant: "default" })
      router.push("/backoffice/users")
    },
    onError: error => {
      enqueueSnackbar(i18n.t("user.snackbar.create.error"), { variant: "default" })
      console.error(error)
    },
  })

  const handleValidate = (values: FormValues) => {
    const errors = {} as {
      identity_number?: string;
      personal_code?: string;
      first_name?: string;
      last_name?: string;
    }
    if (!values.identity_number) {
      errors.identity_number = i18n.t("validation.field.required", { field: i18n.t("identity_number.title") })
    }
    if (!values.personal_code) {
      errors.personal_code = i18n.t("validation.field.required", { field: i18n.t("personal_code.title") })
    }
    if (!values.first_name) {
      errors.first_name = i18n.t("validation.field.required", { field: i18n.t("first_name.title") })
    }
    if (!values.last_name) {
      errors.last_name = i18n.t("validation.field.required", { field: i18n.t("last_name.title") })
    }

    return errors
  }

  const isFetching = isRolesLoading || isScopesLoading
  const isErrorFetching = isRolesError || isScopesError || !roles || !scopes

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
          {i18n.t("pages.backoffice.users.new.title")}
        </Title>
      </Box>

      <Card
        sx={{ p: 2 }}
      >
        <Formik
          initialValues={initialValues}
          validate={(values: FormValues) => handleValidate(values)}
          onSubmit={(values: FormValues, { setSubmitting }) => {
            createMutation.mutate(values, {
              onSettled: () => {
                setSubmitting(false)
              },
            })
          }}
        >
          {({ handleChange, handleBlur, values, errors, touched, isSubmitting }) => (
            <Form>
              <Input
                name="identity_number"
                label={i18n.t("user.form.identity_number.title")}
                placeholder={i18n.t("user.form.identity_number.placeholder")}
                value={values.identity_number}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.identity_number && Boolean(errors.identity_number)}
                helperText={touched.identity_number && errors.identity_number ? errors.identity_number : ""}
              />
              <Input
                name="personal_code"
                label={i18n.t("user.form.personal_code.title")}
                placeholder={i18n.t("user.form.personal_code.placeholder")}
                value={values.personal_code}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.personal_code && Boolean(errors.personal_code)}
                helperText={touched.personal_code && errors.personal_code ? errors.personal_code : ""}
              />
              <Input
                name="first_name"
                label={i18n.t("user.form.first_name.title")}
                placeholder={i18n.t("user.form.first_name.placeholder")}
                value={values.first_name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.first_name && Boolean(errors.first_name)}
                helperText={touched.first_name && errors.first_name ? errors.first_name : ""}
              />
              <Input
                name="last_name"
                label={i18n.t("user.form.last_name.title")}
                placeholder={i18n.t("user.form.last_name.placeholder")}
                value={values.last_name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.last_name && Boolean(errors.last_name)}
                helperText={touched.last_name && errors.last_name ? errors.last_name : ""}
              />
              <CheckboxGroup
                name="role_ids"
                label={i18n.t("user.form.roles.title")}
                options={roles.data.map(
                  (role: RoleType) => ({
                    label: role.name,
                    value: role.id,
                  })
                )}
                values={values.role_ids}
                onChange={handleChange}
              />
              <CheckboxGroup
                name="scope_ids"
                label={i18n.t("user.form.scopes.title")}
                options={scopes.data.map(
                  (scope: ScopeType) => ({
                    label: scope.name,
                    value: scope.id,
                  })
                )}
                values={values.scope_ids}
                onChange={handleChange}
              />

              <Box mt={1} display="flex" justifyContent="flex-start">
                <Button sx={{ mr: 1 }} type="submit" variant="contained" disabled={isSubmitting}>
                  {i18n.t("common.submit")}
                </Button>
                <Link href="/backoffice/users">
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
