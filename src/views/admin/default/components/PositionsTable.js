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
          <Text align="center" color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        ),
      }),
      columnHelper.accessor('strategy', {
        id: 'strategy',
        header: () => (
          <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
            STRATEGY
          </Text>
        ),
        cell: (info) => (
          <Text align="center" color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        ),
      }),
      columnHelper.accessor('direction', {
        id: 'tradeDirection',
        header: () => (
          <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
            TRADE DIRECTION
          </Text>
        ),
        cell: (info) => (
          <Text align="center" color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        ),
      }),
      columnHelper.accessor('amount', {
        id: 'usedAmount',
        header: () => (
          <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
            AMOUNT USED
          </Text>
        ),
        cell: (info) => (
          <Text align="center" color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        ),
      }),
      columnHelper.accessor('leverage', {
        id: 'leverage',
        header: () => (
          <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
            LEVERAGE
          </Text>
        ),
        cell: (info) => (
          <Text align="center" color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}x
          </Text>
        ),
      }),
      columnHelper.accessor('call', {
        id: 'call',
        header: () => (
          <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
            CALL
          </Text>
        ),
        cell: (info) => (
          <Text align="center" color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        ),
      }),
      columnHelper.accessor('tp', {
        id: 'tp',
        header: () => (
          <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
            TAKE PROFIT
          </Text>
        ),
        cell: (info) => (
          <Text align="center" color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue() || 'N/A'}
          </Text>
        ),
      }),
      columnHelper.accessor('sl', {
        id: 'sl',
        header: () => (
          <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
            STOP LOSS
          </Text>
        ),
        cell: (info) => (
          <Text align="center" color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue() || 'N/A'}
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
          <Flex align="center" justify="center">
            <input
              type="checkbox"
              style={{ marginRight: '10px' }}
              onChange={() => handleSelect(info.row.original)}
            />
            <Button
              colorScheme="red"
              size="sm"
              onClick={() => onClosePosition(info.row.original)}
            >
              Close Position
            </Button>
          </Flex>
        ),
      }),
    ];
    
    const table = useReactTable({
      data: positions || [],
      columns,
      state: {
        sorting,
      },
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
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
                <Tr key={row.userId}>
                  {row.getVisibleCells().map((cell) => (
                    <Td
                      key={cell.userId}
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