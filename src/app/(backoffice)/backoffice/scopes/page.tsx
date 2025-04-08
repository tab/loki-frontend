"use client"

import React, { useState } from "react"
import { useSnackbar } from "notistack"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import {
  Box,
  Button,
  TablePagination,
  IconButton,
  Tooltip,
} from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"

import i18n from "@/config/i18n"
import { DEFAULT_PER_PAGE } from "@/config/app"
import { axiosBackofficeInstance as axiosInstance } from "@/lib/axios"
import { useRBAC } from "@/lib/rbac"
import Title from "@/components/ui/Title"
import Table from "@/components/ui/Table"
import Confirmation from "@/components/ui/Confirmation"
import Loader from "@/components/ui/Loader"
import LoaderError from "@/components/ui/Error"
import { ScopeType, PaginatedScopesType } from "@/types/scope"

export default function ScopesPage() {
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()
  const { canManageScopes } = useRBAC()

  const [page, setPage] = useState(0)
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedScope, setSelectedScope] = useState<ScopeType | null>(null)

  const { data, isLoading, isError } = useQuery<PaginatedScopesType>({
    queryKey: ["scopes", page, perPage],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/backoffice/scopes", {
        params: {
          page: page + 1,
          per: perPage,
        },
      })
      return data
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/backoffice/scopes/${id}`)
    },
    onSuccess: () => {
      // @ts-ignore
      queryClient.invalidateQueries(["scopes"])
      enqueueSnackbar(i18n.t("scope.snackbar.destroy.success"), { variant: "default" })
    },
    onError: () => {
      enqueueSnackbar(i18n.t("scope.snackbar.destroy.error"), { variant: "default" })
    },
  })

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPerPage(parseInt(event.target.value, DEFAULT_PER_PAGE))
    setPage(0)
  }

  const handleDeleteClick = (scope: ScopeType) => {
    setSelectedScope(scope)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedScope(null)
  }

  const handleConfirmDelete = () => {
    if (selectedScope) {
      deleteMutation.mutate(selectedScope.id)
    }
    handleCloseDialog()
  }

  if (isLoading) { return <Loader /> }
  if (isError || !data) { return <LoaderError />}

  const columns = [
    { label: i18n.t("scope.id"), accessor: "id", align: "left" },
    { label: i18n.t("scope.name"), accessor: "name", align: "left" },
    { label: i18n.t("scope.description"), accessor: "description", align: "left" },
    { label: i18n.t("common.actions"), accessor: "actions", align: "center" },
  ]

  const rows = data?.data.map((scope: ScopeType) => ({
    id: scope.id,
    name: scope.name,
    description: scope.description,
    actions: (
      <>
        {canManageScopes && (
          <>
            <IconButton
              href={`/backoffice/scopes/${scope.id}/edit`}
              component={Link}
              color="default"
              aria-label={i18n.t("common.edit")}
              sx={{ mr: 1 }}
            >
              <Tooltip title={i18n.t("common.edit")}>
                <EditIcon />
              </Tooltip>
            </IconButton>
            <IconButton
              color="default"
              aria-label={i18n.t("common.delete")}
              onClick={() => handleDeleteClick(scope)}
            >
              <Tooltip title={i18n.t("common.delete")}>
                <DeleteIcon />
              </Tooltip>
            </IconButton>
          </>
        )}
      </>
    ),
  })) || []

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
          {i18n.t("pages.backoffice.scopes.title")}
        </Title>
        {canManageScopes && (
          <Link href="/backoffice/scopes/new" passHref>
            <Button variant="contained" color="primary">
              {i18n.t("common.add")}
            </Button>
          </Link>
        )}
      </Box>

      {/* @ts-ignore */}
      <Table columns={columns} rows={rows} />

      <TablePagination
        component="div"
        count={data?.meta.total || 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={perPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 100]}
        labelRowsPerPage={i18n.t("pagination.rows_per_page")}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} ${i18n.t("pagination.of")} ${
            count !== -1 ? count : `${i18n.t("pagination.more_than")} ${to}`
          }`
        }
      />

      <Confirmation
        open={openDialog}
        title={i18n.t("dialog.delete.title")}
        message={i18n.t("dialog.delete.message", {
          id: selectedScope?.id,
          name: selectedScope?.name,
        })}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDialog}
      />
    </>
  )
}
