export const DEPARTMENTS = [
  { value: 'mechanical', label: 'Mechanical Engineering' },
  { value: 'civil', label: 'Civil Engineering' },
  { value: 'electrical', label: 'Electrical Engineering' },
  { value: 'chemical', label: 'Chemical Engineering' },
  { value: 'petroleum', label: 'Petroleum Engineering' },
  { value: 'agricultural', label: 'Agricultural Engineering' },
  { value: 'mining', label: 'Mining Engineering' },
  { value: 'surveying', label: 'Surveying Engineering' },
];

export const getDepartmentLabel = (val) => {
  const dept = DEPARTMENTS.find((d) => d.value === val);
  return dept ? dept.label : val || 'Unassigned';
};

export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    return new Date(dateStr).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return dateStr;
  }
};