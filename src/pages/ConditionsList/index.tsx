import { useDebounceCallback } from '@react-hook/debounce'
import React, { useCallback, useState } from 'react'
import DataTable from 'react-data-table-component'
import { useHistory } from 'react-router-dom'

import { ButtonDots } from 'components/buttons/ButtonDots'
import { Dropdown, DropdownItem, DropdownPosition } from 'components/common/Dropdown'
import { OraclesFilterDropdown } from 'components/common/OraclesFilterDropdown'
import { SearchField } from 'components/form/SearchField'
import { EmptyContentText } from 'components/pureStyledComponents/EmptyContentText'
import { PageTitle } from 'components/pureStyledComponents/PageTitle'
import { Pill, PillTypes } from 'components/pureStyledComponents/Pill'
import { InfoCard } from 'components/statusInfo/InfoCard'
import { InlineLoading } from 'components/statusInfo/InlineLoading'
import { CellHash } from 'components/table/CellHash'
import { TableControls } from 'components/table/TableControls'
import { useConditions } from 'hooks/useConditions'
import { useLocalStorage } from 'hooks/useLocalStorageValue'
import { customStyles } from 'theme/tableCustomStyles'
import { Conditions_conditions } from 'types/generatedGQL'
import { OracleFilterOptions } from 'util/types'

export const ConditionsList: React.FC = () => {
  const history = useHistory()
  const { setValue } = useLocalStorage('conditionid')

  const [conditionIdToSearch, setConditionIdToSearch] = useState<string>('')
  const [conditionIdToShow, setConditionIdToShow] = useState<string>('')

  const [selectedOracleFilter, setSelectedOracleFilter] = useState<string[]>([])
  const [selectedOracleValue, setSelectedOracleValue] = useState<OracleFilterOptions>(
    OracleFilterOptions.All
  )

  const debouncedHandlerConditionToSearch = useDebounceCallback((conditionIdToSearch) => {
    setConditionIdToSearch(conditionIdToSearch)
  }, 500)

  const onChangeConditionId = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.currentTarget
      setConditionIdToShow(value)
      debouncedHandlerConditionToSearch(value)
    },
    [debouncedHandlerConditionToSearch]
  )

  const { data, error, loading } = useConditions({
    conditionId: conditionIdToSearch,
    oracleValue: selectedOracleValue,
    oracleFilter: selectedOracleFilter,
  })

  const isLoading = !conditionIdToSearch && loading
  const isSearching = conditionIdToSearch && loading

  const buildMenuForRow = useCallback(
    ({ id }) => {
      const detailsOption = {
        text: 'Details',
        onClick: () => history.push(`/conditions/${id}`),
      }

      const splitOption = {
        text: 'Split Position',
        onClick: () => {
          setValue(id)
          history.push(`/split/`)
        },
      }

      const mergeOption = {
        text: 'Merge Positions',
        onClick: () => {
          setValue(id)
          history.push(`/merge/`)
        },
      }

      const reportOption = {
        text: 'Report Payouts',
        onClick: () => {
          setValue(id)
          history.push(`/report/`)
        },
      }

      return [detailsOption, splitOption, mergeOption, reportOption]
    },
    [history, setValue]
  )

  const handleRowClick = useCallback(
    (row: Conditions_conditions) => {
      history.push(`/conditions/${row.id}`)
    },
    [history]
  )

  const columns = [
    {
      // eslint-disable-next-line react/display-name
      cell: (row: Conditions_conditions) => (
        <CellHash
          onClick={() => {
            handleRowClick(row)
          }}
          underline
          value={row.id}
        />
      ),
      name: 'Condition Id',
      selector: 'id',
      sortable: true,
    },
    {
      // eslint-disable-next-line react/display-name
      cell: (row: Conditions_conditions) => (
        <CellHash onClick={() => handleRowClick(row)} value={row.oracle} />
      ),
      name: 'Reporting Address / Oracle',
      selector: 'oracle',
      sortable: true,
    },
    {
      // eslint-disable-next-line react/display-name
      cell: (row: Conditions_conditions) => (
        <CellHash onClick={() => handleRowClick(row)} value={row.questionId} />
      ),
      name: 'Question Id',
      selector: 'questionId',
      sortable: true,
    },
    {
      maxWidth: '150px',
      name: 'Outcomes',
      right: true,
      selector: 'outcomeSlotCount',
      sortable: true,
    },
    {
      center: true,
      name: 'Status',
      selector: 'resolved',
      sortable: true,
      width: '150px',
      // eslint-disable-next-line react/display-name
      cell: (row: Conditions_conditions) =>
        row.resolved ? (
          <Pill onClick={() => handleRowClick(row)} type={PillTypes.primary}>
            Resolved
          </Pill>
        ) : (
          <Pill onClick={() => handleRowClick(row)} type={PillTypes.open}>
            Open
          </Pill>
        ),
      sortFunction: (a: Conditions_conditions, b: Conditions_conditions) => {
        const valA = a.resolved ? 2 : 1
        const valB = b.resolved ? 2 : 1
        return valA - valB
      },
    },
    {
      // eslint-disable-next-line react/display-name
      cell: (row: Conditions_conditions) => (
        <Dropdown
          activeItemHighlight={false}
          dropdownButtonContent={<ButtonDots />}
          dropdownPosition={DropdownPosition.right}
          items={buildMenuForRow(row).map((item, index) => (
            <DropdownItem key={index} onClick={item.onClick}>
              {item.text}
            </DropdownItem>
          ))}
        />
      ),
      name: '',
      width: '60px',
      right: true,
    },
  ]

  return (
    <>
      <PageTitle>Conditions</PageTitle>
      {isLoading && <InlineLoading />}
      {error && <InfoCard message={error.message} title="Error" />}
      {data && !isLoading && !error && (
        <>
          <TableControls
            end={
              <OraclesFilterDropdown
                onClick={(value: OracleFilterOptions, filter: string[]) => {
                  setSelectedOracleFilter(filter)
                  setSelectedOracleValue(value)
                }}
                value={selectedOracleValue}
              />
            }
            start={
              <SearchField
                onChange={onChangeConditionId}
                placeholder="Search by condition id..."
                value={conditionIdToShow}
              />
            }
          />
          {isSearching && <InlineLoading />}
          {!isSearching && (
            <DataTable
              className="outerTableWrapper"
              columns={columns}
              customStyles={customStyles}
              data={data?.conditions || []}
              highlightOnHover
              noDataComponent={<EmptyContentText>No conditions found.</EmptyContentText>}
              noHeader
              onRowClicked={handleRowClick}
              pagination
              responsive
            />
          )}
        </>
      )}
    </>
  )
}
