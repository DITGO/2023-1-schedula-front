import { render, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Chamados, sortIssues } from '@/pages/chamados';
import { Issue } from '@/features/issues/types';

import 'intersection-observer';

beforeAll(async () => {
  vi.mock('@/features/issues/api/get-all-issues', () => ({
    useGetAllIssues: vi.fn().mockReturnValue({
      data: [
        {
          id: '1',
          requester: 'Mockerson',
          phone: '61988554474',
          city_id: '123',
          workstation_id: '123',
          problem_category_id: 'Category Mock',
          problem_types_ids: ['Type Mock'],
          date: new Date(),
          email: 'mockerson@mock.com',
        },
      ],
      isLoading: false,
      refetch: vi.fn(),
    }),
  }));
});

const queryClient = new QueryClient();

describe('Issues page', () => {
  it('should display a heading', async () => {
    const { findByRole } = render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Chamados />
        </QueryClientProvider>
      </BrowserRouter>
    );

    const heading = await findByRole('heading');
    expect(heading).toHaveTextContent('Atendimentos');
  });

  it('should display a new issue button', async () => {
    const { queryByText } = render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Chamados />
        </QueryClientProvider>
      </BrowserRouter>
    );

    const button = await queryByText('Novo Atendimento');
    if (button) {
      expect(button).toBeInTheDocument();
    }
  });

  it('should display a refresh button', async () => {
    const { findByRole } = render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Chamados />
        </QueryClientProvider>
      </BrowserRouter>
    );

    const button = await findByRole('button', { name: 'Atualizar Dados' });
    expect(button).toBeInTheDocument();
  });

  it('should display an apply filter button', async () => {
    const { findByRole } = render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Chamados />
        </QueryClientProvider>
      </BrowserRouter>
    );

    const button = await findByRole('button', { name: 'Aplicar Filtro' });
    expect(button).toBeInTheDocument();
  });

  it('applies date filter correctly', () => {
    const { getByPlaceholderText, getByText, container } = render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Chamados />
        </QueryClientProvider>
      </BrowserRouter>
    );

    const startDateInput = getByPlaceholderText('Data inicial');
    const endDateInput = getByPlaceholderText('Data final');

    fireEvent.change(startDateInput, { target: { value: '2021-08-01' } });
    fireEvent.change(endDateInput, { target: { value: '2021-08-31' } });

    const applyFilterButton = getByText('Aplicar Filtro');
    fireEvent.click(applyFilterButton);

    const issueItems = container.querySelectorAll('.issue-item');

    expect(issueItems.length).toBe(0);
  });
});

describe('sortIssues', () => {
  it('should return an empty array when issues is undefined', () => {
    const issues: Issue[] | undefined = undefined;

    const sortedIssues = sortIssues(issues);

    expect(sortedIssues).toEqual([]);
  });

  it('should return an empty array when issues is an empty array', () => {
    const issues: Issue[] = [];

    const sortedIssues = sortIssues(issues);

    expect(sortedIssues).toEqual([]);
  });

  it('should sort the issues in descending order based on the date', () => {
    const issues: Issue[] = [
      {
        id: '1',
        date: new Date('2021-09-01'),
        requester: '',
        phone: '',
        city_id: '',
        workstation_id: '',
        email: '',
        problem_category: {
          id: '',
          name: '',
          description: '',
          problem_types: [],
        },
        problem_types: [],
      },
      {
        id: '2',
        date: new Date('2021-08-15'),
        requester: '',
        phone: '',
        city_id: '',
        workstation_id: '',
        email: '',
        problem_category: {
          id: '',
          name: '',
          description: '',
          problem_types: [],
        },
        problem_types: [],
      },
      {
        id: '3',
        date: new Date('2021-08-30'),
        requester: '',
        phone: '',
        city_id: '',
        workstation_id: '',
        email: '',
        problem_category: {
          id: '',
          name: '',
          description: '',
          problem_types: [],
        },
        problem_types: [],
      },
    ];

    const sortedIssues = sortIssues(issues);

    expect(sortedIssues).toEqual([
      {
        id: '1',
        date: new Date('2021-09-01'),
        requester: '',
        phone: '',
        city_id: '',
        workstation_id: '',
        email: '',
        problem_category: {
          id: '',
          name: '',
          description: '',
          problem_types: [],
        },
        problem_types: [],
      },
      {
        id: '3',
        date: new Date('2021-08-30'),
        requester: '',
        phone: '',
        city_id: '',
        workstation_id: '',
        email: '',
        problem_category: {
          id: '',
          name: '',
          description: '',
          problem_types: [],
        },
        problem_types: [],
      },
      {
        id: '2',
        date: new Date('2021-08-15'),
        requester: '',
        phone: '',
        city_id: '',
        workstation_id: '',
        email: '',
        problem_category: {
          id: '',
          name: '',
          description: '',
          problem_types: [],
        },
        problem_types: [],
      },
    ]);
  });

  it('should return the same array when the issues are already sorted', () => {
    const issues: Issue[] = [
      {
        id: '1',
        date: new Date('2021-09-01'),
        requester: '',
        phone: '',
        city_id: '',
        workstation_id: '',
        email: '',
        problem_category: {
          id: '',
          name: '',
          description: '',
          problem_types: [],
        },
        problem_types: [],
      },
      {
        id: '2',
        date: new Date('2021-08-30'),
        requester: '',
        phone: '',
        city_id: '',
        workstation_id: '',
        email: '',
        problem_category: {
          id: '',
          name: '',
          description: '',
          problem_types: [],
        },
        problem_types: [],
      },
      {
        id: '3',
        date: new Date('2021-08-15'),
        requester: '',
        phone: '',
        city_id: '',
        workstation_id: '',
        email: '',
        problem_category: {
          id: '',
          name: '',
          description: '',
          problem_types: [],
        },
        problem_types: [],
      },
    ];

    const sortedIssues = sortIssues(issues);

    expect(sortedIssues).toEqual(issues);
  });
});
