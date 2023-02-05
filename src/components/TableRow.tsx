import { type Employee } from "@prisma/client";

const TableRow = ({ employee }: { employee: Employee }) => {
  return (
    <tr key={employee.id} className="border-b dark:border-gray-700">
      <th scope="row" className="whitespace-nowrap px-6 py-4 font-medium">
        Apple MacBook Pro 17
      </th>
      <td className="px-6 py-4">Sliver</td>
      <td className="px-6 py-4">Laptop</td>
      <td className="px-6 py-4">$2999</td>
    </tr>
  );
};

export default TableRow;
