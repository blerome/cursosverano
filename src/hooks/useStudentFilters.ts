import { useState, useMemo } from 'react';
import type { GetStudentByClassResponseDto } from '../generated/model';

type SortField = 'name' | 'control' | 'career';
type SortOrder = 'asc' | 'desc';

/**
 * Hook para manejar filtros, búsqueda y ordenamiento de estudiantes
 */
export const useStudentFilters = (students: GetStudentByClassResponseDto[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [showLeadersOnly, setShowLeadersOnly] = useState(false);

  // Función para manejar el ordenamiento
  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Filtrar y ordenar estudiantes
  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students.filter((studentClass: GetStudentByClassResponseDto) => {
      const fullName = `${studentClass.student.user.name} ${studentClass.student.user.paternal_surname}`.toLowerCase();
      const controlNumber = studentClass.student.control_number?.toString().toLowerCase() || '';
      const career = studentClass.student.career?.name?.toLowerCase() || '';
      
      const matchesSearch = searchTerm === '' || 
        fullName.includes(searchTerm.toLowerCase()) ||
        controlNumber.includes(searchTerm.toLowerCase()) ||
        career.includes(searchTerm.toLowerCase());
      
      const matchesFilter = !showLeadersOnly || studentClass.group_leader;
      
      return matchesSearch && matchesFilter;
    });

    // Ordenar
    filtered.sort((a: GetStudentByClassResponseDto, b: GetStudentByClassResponseDto) => {
      let aValue = '';
      let bValue = '';
      
      switch (sortBy) {
        case 'name':
          aValue = `${a.student.user.name} ${a.student.user.paternal_surname}`;
          bValue = `${b.student.user.name} ${b.student.user.paternal_surname}`;
          break;
        case 'control':
          aValue = a.student.control_number?.toString() || '';
          bValue = b.student.control_number?.toString() || '';
          break;
        case 'career':
          aValue = a.student.career?.name || '';
          bValue = b.student.career?.name || '';
          break;
      }
      
      const comparison = aValue.localeCompare(bValue);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [students, searchTerm, sortBy, sortOrder, showLeadersOnly]);

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setSortBy('name');
    setSortOrder('asc');
    setShowLeadersOnly(false);
  };

  return {
    // Estados de filtros
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    showLeadersOnly,
    setShowLeadersOnly,
    
    // Datos filtrados
    filteredStudents: filteredAndSortedStudents,
    
    // Acciones
    handleSort,
    clearFilters,
    
    // Estadísticas
    filteredCount: filteredAndSortedStudents.length,
    hasFilters: searchTerm !== '' || showLeadersOnly,
  };
}; 