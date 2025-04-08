"use client"

import React, { useState } from "react"
import { useSnackbar } from "notistack"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Box,
  TablePagination,
  IconButton,
  Tooltip,
} from "@mui/material"
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
import { formatDate } from "@/lib/formatters/formatDate"
import { TokenType, PaginatedTokensType } from "@/types/token"
import { PaginatedUsersType, UserType } from "@/types/user"

export default function TokensPage() {
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()
  const { canManageTokens } = useRBAC()

  const [page, setPage] = useState(0)
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedToken, setSelectedToken] = useState<TokenType | null>(null)

  const { data, isLoading, isError } = useQuery<PaginatedTokensType>({
    queryKey: ["tokens", page, perPage],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/backoffice/tokens", {
        params: {
          page: page + 1,
          per: perPage,
        },
      })
      return data
    },
  })

  const {
    data: users,
    isLoading: isUsersLoading,
    isError: isUsersError
  } = useQuery<PaginatedUsersType>({
    queryKey: ["users", 1, 1000],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/backoffice/users", {
        params: {
          page: 1,
          per: 1000,
        },
      })
      return data
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/backoffice/tokens/${id}`)
    },
    onSuccess: () => {
      // @ts-ignore
      queryClient.invalidateQueries(["tokens"])
      enqueueSnackbar(i18n.t("token.snackbar.destroy.success"), { variant: "default" })
    },
    onError: () => {
      enqueueSnackbar(i18n.t("token.snackbar.destroy.error"), { variant: "default" })
    },
  })

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPerPage(parseInt(event.target.value, DEFAULT_PER_PAGE))
    setPage(0)
  }

  const handleDeleteClick = (token: TokenType) => {
    setSelectedToken(token)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedToken(null)
  }

  const handleConfirmDelete = () => {
    if (selectedToken) {
      deleteMutation.mutate(selectedToken.id)
    }
    handleCloseDialog()
  }

  const isFetching = isLoading || isUsersLoading
  const isErrorFetching = isError || isUsersError || !data || !users

  if (isFetching) { return <Loader /> }
  if (isErrorFetching) { return <LoaderError />}

  const columns = [
    { label: i18n.t("token.id"), accessor: "id", align: "left" },
    { label: i18n.t("token.user"), accessor: "user", align: "left" },
    { label: i18n.t("token.type"), accessor: "type", align: "left" },
    { label: i18n.t("token.expires_at"), accessor: "expires_at", align: "left" },
    { label: i18n.t("common.actions"), accessor: "actions", align: "center" },
  ]

  const rows = data?.data.map((token: TokenType) => ({
    id: token.id,
    user: users.data.find((user: UserType) => user.id === token.user_id)?.identity_number,
    type: token.type,
    expires_at: formatDate(token.expires_at),
    actions: (
      <>
        {canManageTokens && (
          <IconButton
            color="default"
            aria-label={i18n.t("common.delete")}
            onClick={() => handleDeleteClick(token)}
          >
            <Tooltip title={i18n.t("common.delete")}>
              <DeleteIcon />
            </Tooltip>
          </IconButton>
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
          {i18n.t("pages.backoffice.tokens.title")}
        </Title>
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
          id: selectedToken?.id,
        })}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDialog}
      />
    </>
  )
}
