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
import { UserType, PaginatedUsersType } from "@/types/user"

export default function UsersPage() {
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()
  const { canManageUsers } = useRBAC()

  const [page, setPage] = useState(0)
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)

  const { data, isLoading, isError } = useQuery<PaginatedUsersType>({
    queryKey: ["users", page, perPage],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/backoffice/users", {
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
      await axiosInstance.delete(`/backoffice/users/${id}`)
    },
    onSuccess: () => {
      // @ts-ignore
      queryClient.invalidateQueries(["users"])
      enqueueSnackbar(i18n.t("user.snackbar.destroy.success"), { variant: "default" })
    },
    onError: () => {
      enqueueSnackbar(i18n.t("user.snackbar.destroy.error"), { variant: "default" })
    },
  })

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPerPage(parseInt(event.target.value, DEFAULT_PER_PAGE))
    setPage(0)
  }

  const handleDeleteClick = (user: UserType) => {
    setSelectedUser(user)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedUser(null)
  }

  const handleConfirmDelete = () => {
    if (selectedUser) {
      deleteMutation.mutate(selectedUser.id)
    }
    handleCloseDialog()
  }

  if (isLoading) { return <Loader /> }
  if (isError || !data) { return <LoaderError />}

  const columns = [
    { label: i18n.t("user.id"), accessor: "id", align: "left" },
    { label: i18n.t("user.identity_number"), accessor: "identity_number", align: "left" },
    { label: i18n.t("user.personal_code"), accessor: "personal_code", align: "left" },
    { label: i18n.t("user.first_name"), accessor: "first_name", align: "left" },
    { label: i18n.t("user.last_name"), accessor: "last_name", align: "left" },
    { label: i18n.t("common.actions"), accessor: "actions", align: "center" },
  ]

  const rows = data?.data.map((user: UserType) => ({
    id: user.id,
    identity_number: user.identity_number,
    personal_code: user.personal_code,
    first_name: user.first_name,
    last_name: user.last_name,
    actions: (
      <>
        {canManageUsers && (
          <>
            <IconButton
              href={`/backoffice/users/${user.id}/edit`}
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
              onClick={() => handleDeleteClick(user)}
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
          {i18n.t("pages.backoffice.users.title")}
        </Title>
        {canManageUsers && (
          <Link href="/backoffice/users/new" passHref>
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
          id: selectedUser?.id,
          identity_number: selectedUser?.identity_number,
        })}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDialog}
      />
    </>
  )
}
