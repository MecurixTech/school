"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { LoadingSpinner } from "@/components/loading-spinner2"
import { Search, Filter, Plus, Eye, Edit, Trash2, RefreshCw } from "lucide-react"
import Link from "next/link"

interface Column<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
}

interface DataTableProps<T extends { id: string }> {
  title: string
  data: T[]
  columns: Column<T>[]
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  onDelete?: (id: string) => void
  onRefresh?: () => void
  createHref?: string
  viewHref?: (id: string) => string
  editHref?: (id: string) => string
  renderCell?: (item: T, column: Column<T>) => React.ReactNode
  loading?: boolean
}

export function DataTable<T extends { id: string }>({
  title,
  data,
  columns,
  searchPlaceholder = "Search...",
  onSearch,
  onDelete,
  onRefresh,
  createHref,
  viewHref,
  editHref,
  renderCell,
  loading = false,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    id: string
    name: string
  }>({
    open: false,
    id: "",
    name: "",
  })

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
  }

  const handleDeleteClick = (item: T) => {
    const name =
      (item as any).full_name ||
      (item as any).name ||
      `Item ${item.id.slice(0, 8)}`
    setDeleteDialog({ open: true, id: item.id, name })
  }

  const handleDeleteConfirm = () => {
    onDelete?.(deleteDialog.id)
    setDeleteDialog({ open: false, id: "", name: "" })
  }

  const filteredData = useMemo(() => {
    if (!searchQuery) return data
    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  }, [data, searchQuery])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground">
            Manage and organize your {title.toLowerCase()} efficiently
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          )}
          {createHref && (
            <Button asChild>
              <Link href={createHref}>
                <Plus className="mr-2 h-4 w-4" />
                Add New
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 bg-background"
                disabled={loading}
              />
            </div>
            <Button variant="outline" size="sm" disabled={loading}>
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <span>
              {loading
                ? "Loading..."
                : `${filteredData.length} ${
                    filteredData.length === 1 ? "record" : "records"
                  }`}
            </span>
            {!loading && searchQuery && (
              <span className="text-sm font-normal text-muted-foreground">
                Filtered by "{searchQuery}"
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8">
              <LoadingSpinner size="lg" text="Loading data..." />
            </div>
          ) : filteredData.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-muted-foreground">
                {searchQuery
                  ? `No results found for "${searchQuery}"`
                  : "No records found"}
              </div>
              {createHref && !searchQuery && (
                <Button asChild className="mt-4 bg-transparent" variant="outline">
                  <Link href={createHref}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Record
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border/50 bg-muted/20">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={String(column.key)}
                        scope="col"
                        className="text-left p-4 font-medium text-muted-foreground text-sm"
                      >
                        {column.label}
                      </th>
                    ))}
                    <th
                      scope="col"
                      className="text-left p-4 font-medium text-muted-foreground text-sm"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border-b border-border/50 hover:bg-accent/50 transition-colors ${
                        index % 2 === 0 ? "bg-background" : "bg-accent/20"
                      }`}
                    >
                      {columns.map((column) => (
                        <td key={String(column.key)} className="p-4">
                          {renderCell
                            ? renderCell(item, column)
                            : String(item[column.key as keyof T] ?? "")}
                        </td>
                      ))}
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          {viewHref && (
                            <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Link href={viewHref(item.id)}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                          {editHref && (
                            <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Link href={editHref(item.id)}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(item)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        title="Delete Record"
        description={`Are you sure you want to delete "${deleteDialog.name}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        destructive
      />
    </div>
  )
}
