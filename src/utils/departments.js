export const DEPARTMENTS = [
  { value: "surveying", label: "Surveying Engineering" },
  { value: "agricultural", label: "Agricultural Engineering" },
  { value: "civil", label: "Civil Engineering" },
  { value: "electrical", label: "Electrical and Electronics Engineering" },
  { value: "mechanical", label: "Mechanical Engineering" },
  { value: "mining", label: "Mining Engineering" },
  { value: "chemical", label: "Chemical Engineering" },
  { value: "petroleum", label: "Petroleum Engineering" },
];

export const displayDepartment = (departmentValue) => {
  const filteredDepartments = DEPARTMENTS.filter(
    (department) => department.value == departmentValue,
  );
  return filteredDepartments.length > 0 ? filteredDepartments[0].label : "";
};
