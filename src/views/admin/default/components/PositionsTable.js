/* eslint-disable */

import {
    Flex,
    Box,
    Table,
    Button,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue,
  } from '@chakra-ui/react';
  import * as React from 'react';
  
  import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
  } from '@tanstack/react-table';
  
  // Custom components
  import Card from 'components/card/Card';
  import Menu from 'components/menu/MainMenu';
  
  const columnHelper = createColumnHelper();
  
  export default function TradePositionTable({ positions, onClosePosition }) {
    const [sorting, setSorting] = React.useState([]);
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  
    const columns = [
      columnHelper.accessor('userName', {
        id: 'userName',
        header: () => (
          <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
            USER NAME
          </Text>
        ),
        cell: (info) => (
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        ),
      }),
      columnHelper.accessor('symbol', {
        id: 'symbol',
        header: () => (
          <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
            SYMBOL
          </Text>
        ),
        cell: (info) => (
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        ),
      }),
      columnHelper.accessor('positionAmt', {
        id: 'positionAmt',
        header: () => (
          <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
            POSITION AMOUNT
          </Text>
        ),
        cell: (info) => (
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        ),
      }),
      columnHelper.accessor('entryPrice', {
        id: 'entryPrice',
        header: () => (
          <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
            ENTRY PRICE
          </Text>
        ),
        cell: (info) => (
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        ),
      }),
      columnHelper.accessor('close', {
        id: 'close',
        header: () => (
          <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
            ACTION
          </Text>
        ),
        cell: (info) => (
          <Button
            colorScheme="red"
            size="sm"
            onClick={() => onClosePosition(info.row.original)}
          >
            Close Position
          </Button>
        ),
      }),
    ];
  
    const table = useReactTable({
      data: positions,
      columns,
      state: {
        sorting,
      },
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      debugTable: true,
    });
  
    return (
      <Card
        flexDirection="column"
        w="100%"
        px="0px"
        overflowX={{ sm: 'scroll', lg: 'hidden' }}
      >
        <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
          <Text
            color={textColor}
            fontSize="22px"
            mb="4px"
            fontWeight="700"
            lineHeight="100%"
          >
            Open Trade Positions
          </Text>
          <Menu />
        </Flex>
        <Box>
          <Table variant="simple" color="gray.500" mb="24px" mt="12px">
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th
                      key={header.id}
                      colSpan={header.colSpan}
                      pe="10px"
                      borderColor={borderColor}
                      cursor="pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <Text
                        justifyContent="space-between"
                        align="center"
                        fontSize={{ sm: '10px', lg: '12px' }}
                        color="gray.400"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </Text>
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {table.getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td
                      key={cell.id}
                      fontSize={{ sm: '14px' }}
                      minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                      borderColor="transparent"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Card>
    );
  }