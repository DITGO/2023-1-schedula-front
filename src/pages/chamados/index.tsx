import {
  Button,
  HStack,
  Box,
  Input,
  Text,
  Flex,
  Divider,
  useDisclosure,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { TiFilter } from 'react-icons/ti';
import { IoClose } from 'react-icons/io5';
import { RefreshButton } from '@/components/action-buttons/refresh-button';
import { PageHeader } from '@/components/page-header';
import { useGetAllIssues } from '@/features/issues/api/get-all-issues';
import { useGetReport } from '@/features/reports/api/get-report';
import { Issue } from '@/features/issues/types';
import { Permission } from '@/components/permission';
import { ListView } from '@/components/list';
import { IssueItem } from '@/features/issues/components/issue-item';
import { useDeleteIssue } from '@/features/issues/api/delete-issue';
import { ScheduleModal } from '@/features/schedules/components/schedule-modal';
import { toast } from '@/utils/toast';

export function sortIssues(issues: Issue[] | undefined): Issue[] {
  if (!issues) {
    return [];
  }

  return issues.slice().sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    return dateB.getTime() - dateA.getTime();
  });
}

export function Chamados() {
  const {
    data: issues,
    isLoading: isLoadingIssues,
    refetch,
  } = useGetAllIssues();
  const { mutate: deleteIssue, isLoading: isRemovingIssue } = useDeleteIssue();
  const {
    isLoading: isLoadingReport,
    data: report,
    mutate: getReport,
  } = useGetReport({
    onSuccessCallBack: () => {},
  });

  const onDelete = useCallback(
    (issueId: string) => {
      deleteIssue({ issueId });
    },
    [deleteIssue]
  );

  const [issueToCreate, setIssueToCreate] = useState<Issue>();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const onCreate = useCallback(
    (issue: Issue) => {
      setIssueToCreate(issue);
      onOpen();
    },
    [onOpen]
  );

  const renderIssueItem = useCallback(
    (issue: Issue) => (
      <IssueItem
        issue={issue}
        onDelete={onDelete}
        isDeleting={isRemovingIssue}
        onOpen={() => onCreate(issue)}
      />
    ),
    [onDelete, isRemovingIssue, onCreate]
  );

  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);

  const handleStartDateChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setStartDate(event.target.value);
    },
    []
  );

  const handleEndDateChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEndDate(event.target.value);
    },
    []
  );

  const applyFilter = useCallback(() => {
    setIsFiltering(true);
  }, []);

  const clearFilter = useCallback(() => {
    setIsFiltering(false);
    setStartDate(null);
    setEndDate(null);
  }, []);

  const handleExport = useCallback(async () => {
    if (!startDate || !endDate) {
      toast.warning('Selecione um período para exportar o relatório');
      return;
    }

    // Wait for report to be generated
    await getReport({
      startDate,
      endDate,
    });

    // Reset filter
    clearFilter();
  }, [startDate, endDate, getReport, clearFilter]);

  useEffect(() => {
    if (!isLoadingReport && report) {
      const reportData = report.data;
      const byteArray = new Uint8Array(reportData);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const fileUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `RELATÓRIO-${new Date().toLocaleString('pr-br', {
        timeZone: 'America/Sao_Paulo',
      })}.pdf`;
      link.click();

      URL.revokeObjectURL(fileUrl);

      console.log('Relatório gerado com sucesso!');
    }
  }, [isLoadingReport, report]);

  let filteredIssues = issues;

  if (isFiltering) {
    filteredIssues = filteredIssues?.filter((issue) => {
      const issueDate = new Date(issue.date).toISOString().split('T')[0];
      return (
        (!startDate || issueDate >= startDate) &&
        (!endDate || issueDate <= endDate)
      );
    });
  }

  filteredIssues = sortIssues(filteredIssues);

  return (
    <>
      <PageHeader title="Atendimentos">
        <HStack spacing={2}>
          <RefreshButton refresh={refetch} />
          <Button onClick={handleExport} variant="outline">
            Exportar
          </Button>
          <Permission allowedRoles={['ADMIN', 'BASIC']}>
            <Link to="/chamados/registrar">
              <Button variant="primary">Novo Atendimento</Button>
            </Link>
          </Permission>
        </HStack>
      </PageHeader>

      <Flex direction={['column', 'row']} align="center">
        <Text color="gray.500" mr={2}>
          <b>Data inicial</b>
        </Text>
        <Box mb={[4, 0]} mr={4}>
          <Input
            type="date"
            onChange={handleStartDateChange}
            value={startDate || ''}
            placeholder="Data inicial"
          />
        </Box>
        <Text color="gray.500" mr={2}>
          <b>Data final</b>
        </Text>
        <Box mb={[4, 0]} mr={4}>
          <Input
            type="date"
            onChange={handleEndDateChange}
            value={endDate || ''}
            placeholder="Data final"
          />
        </Box>
        <Button leftIcon={<TiFilter />} onClick={applyFilter} mr={2}>
          Aplicar Filtro
        </Button>
        {isFiltering && (
          <Button
            leftIcon={<IoClose />}
            onClick={clearFilter}
            variant="outline"
            color="primary"
          >
            Limpar Filtro
          </Button>
        )}
      </Flex>

      <Divider my={5} />

      <ListView<Issue>
        items={filteredIssues}
        render={renderIssueItem}
        isLoading={isLoadingIssues}
      />

      <ScheduleModal issue={issueToCreate} isOpen={isOpen} onClose={onClose} />
    </>
  );
}
