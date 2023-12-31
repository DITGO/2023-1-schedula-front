import { useNavigate } from 'react-router-dom';
import { useCallback, useState, useEffect, useMemo } from 'react';
import {
  Button,
  Grid,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { Props, Select } from 'chakra-react-select';
import { FaSearch, FaTags } from 'react-icons/fa';
import { CloseIcon } from '@chakra-ui/icons';
import { PageHeader } from '@/components/page-header';
import { useGetallTutorials } from '@/features/tutorials/api/get-all-tutorials';
import { ListView } from '@/components/list';
import { TutorialItem } from '@/features/tutorials/components/tutorial-item';
import { Tutorial } from '@/features/tutorials/api/types';
import {
  chakraStyles,
  customComponents,
} from '@/components/form-fields/controlled-select/styles';
import { Permission } from '@/components/permission';

export function Tutoriais() {
  const { data: tutorials, isLoading } = useGetallTutorials();

  const [filteredTutorials, setFilteredTutorials] = useState<Tutorial[]>(
    tutorials || []
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const renderTutorialItem = useCallback(
    (tutorial: Tutorial) => <TutorialItem tutorial={tutorial} />,
    []
  );

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const searchText = event.target.value.toLowerCase();
      const filteredTutorials = tutorials?.filter((tutorial) =>
        tutorial.name.toLowerCase().includes(searchText)
      );
      setFilteredTutorials(filteredTutorials || []);
      setSelectedCategory('');
    },
    [tutorials]
  );

  const handleResetFilters = useCallback(() => {
    setFilteredTutorials(tutorials || []);
    setSelectedCategory('');
  }, [tutorials]);

  useEffect(() => {
    let updatedTutorials = tutorials || [];
    if (selectedCategory) {
      updatedTutorials = updatedTutorials.filter(
        (tutorial) => tutorial.category.name === selectedCategory
      );
    }
    updatedTutorials.sort((a, b) => a.name.localeCompare(b.name));
    setFilteredTutorials(updatedTutorials);
  }, [tutorials, selectedCategory, handleResetFilters]);

  const handleChangeFilter = (option: any) => {
    setSelectedCategory(option?.value || '');
  };

  const options = useMemo(() => {
    const uniqueCategories = new Set(
      tutorials?.map((tutorial) => tutorial.category.name)
    );

    const allCategoriesOption = { label: 'Todas as categorias', value: '' };
    const categoryOptions = [...uniqueCategories].map((category) => ({
      label: category,
      value: category,
    }));

    return selectedCategory
      ? [allCategoriesOption, ...categoryOptions]
      : categoryOptions;
  }, [tutorials, selectedCategory]);

  const navigate = useNavigate();

  return (
    <>
      <PageHeader title="Tutoriais">
        <Permission allowedRoles={['ADMIN']}>
          <Button
            variant="primary"
            onClick={() => navigate('categorias_de_tutorial')}
          >
            Gerenciamento de categorias
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('gerenciar-tutorial')}
            style={{ marginLeft: 30 }}
          >
            Gerenciar tutoriais
          </Button>
        </Permission>
      </PageHeader>

      <Grid templateColumns="repeat(2, 1fr)" gap={8} marginBottom="4">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={FaSearch} boxSize={4} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Pesquisar tutoriais"
            onChange={handleSearch}
            _placeholder={{ color: 'gray.400' }}
          />
        </InputGroup>
        <Select
          aria-label="Filtrar por categoria"
          placeholder={
            <Flex alignItems="center">
              <Icon as={FaTags} boxSize={4} mr={2} />
              Categoria
            </Flex>
          }
          options={options}
          onChange={handleChangeFilter}
          isClearable
          isSearchable={false}
          chakraStyles={chakraStyles}
          components={customComponents}
        />
      </Grid>

      <ListView<Tutorial>
        items={filteredTutorials}
        render={renderTutorialItem}
        isLoading={isLoading}
      />
    </>
  );
}
