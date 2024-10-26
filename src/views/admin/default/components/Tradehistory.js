/* eslint-disable */
import {
    Flex,
    Box,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue,
    Spinner,
  } from '@chakra-ui/react';
import * as React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
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
  
  export default function TradeHistoryTable() {
    const [sorting, setSorting] = React.useState([]);
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
    const [tradeHistory, setPositionsHistory] = useState([]); // Your trade positions data
      const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
 // const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Page counter for pagination
  const [hasMore, setHasMore] = useState(true); // To track if there are more logs to load
  const observerRef = useRef(); // Ref for the observer
    const jwttoken = localStorage.getItem("jwtToken");
  

      
        // Fetch logs based on the page
  const fetchPositionhistory = useCallback(async (page) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKENDAPI}/api/binance/all-past-trades?page=${page}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwttoken}`,
        }
      });
      const data = await response.json();
      console.log('position history', data);

        setPositionsHistory((prevHistory) => [...prevHistory, ...data.pastTrades]);
      setHasMore(data.pastTrades && data.pastTrades.length > 0);
    } catch (err) {
      setError('Error fetching logs');
    } finally {
      setLoading(false);
    }
  }, [jwttoken]);

  useEffect(() => {
    // Fetch the initial set of logs
    fetchPositionhistory(page);
  }, [page, fetchPositionhistory]);

  // Observer callback to load more logs when scrolled to bottom
  const lastLogRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1); // Load next page
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore]
  );
  
    const columns = [
      columnHelper.accessor('dateOpened', {
        id: 'closeTime',
        header: () => (
          <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
            CLOSE TIME
          </Text>
        ),
        cell: (info) => {
          const timestamp = info.getValue();
          if(timestamp) {

            const date = new Date(timestamp);
  
            const formattedDate = new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
            }).format(date);
            return (
                <Text align="center" color={textColor} fontSize="sm" fontWeight="700">
                {formattedDate}
                </Text>
            );
          }
          
  
          
        },
      }),
      columnHelper.accessor('entryPrice', {
        id: 'entryPrice',
        header: () => (
          <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
            ENTRY PRICE
          </Text>
        ),
        cell: (info) => (
          <Text align="center" color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        ),
      }),
      columnHelper.accessor('userName', {
        id: 'userName',
        header: () => (
          <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
            USERNAME
          </Text>
        ),
        cell: (info) => (
          <Text align="center" color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        ),
      }),
      columnHelper.accessor('symbol', {
        id: 'exitPrice',
        header: () => (
          <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
            SYMBOL
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
      columnHelper.accessor('quantity', {
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
      columnHelper.accessor('pnl', {
        id: 'profitLoss',
        header: () => (
          <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
            P/L
          </Text>
        ),
        cell: (info) => (
          <Text
            align="center"
            color={info.getValue() >= 0 ? 'green.400' : 'red.400'}
            fontSize="sm"
            fontWeight="700"
          >
            {info.getValue() || 0} {info.getValue() >= 0 ? 'Profit' : 'Loss'}
          </Text>
        ),
      }),
    ];
  
    const table = useReactTable({
      data: tradeHistory || [],
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
            Trade History
          </Text>
        </Flex>
        <Box maxHeight="400px" overflowY="auto">
          <Table variant="simple" color="gray.500" mb="24px" mt="12px">
            <Thead position="sticky" top="0" zIndex="docked" bg={useColorModeValue('gray.50', 'gray.800')}>
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
              {table.getRowModel().rows.map((row, index) => (
                <Tr key={row.id} ref={index === table.getRowModel().rows.length - 1 ? lastLogRef : null}>
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
                  {loading && (
        <Flex justifyContent="center" alignItems="center" mt={4}>
          <Spinner />
        </Flex>
      )}
          </Table>
        </Box>
      </Card>
    );
  }  
