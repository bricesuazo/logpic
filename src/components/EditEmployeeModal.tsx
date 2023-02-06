import { Dialog, Transition } from "@headlessui/react";
import { type Employee } from "@prisma/client";
import { Fragment, useEffect, useState } from "react";
import { api } from "../utils/api";

const EditEmployeeModal = ({
  isOpen,
  setIsOpen,
  employee,
  refetch,
}: {
  isOpen: boolean;
  setIsOpen: () => void;
  employee: Employee;
  refetch: () => void;
}) => {
  const editEmployeeMutation = api.hr.updateEmployee.useMutation();
  const [employeeState, setEmployeeState] = useState<Employee>();

  useEffect(() => {
    setEmployeeState(employee);
  }, [employee]);

  if (!employeeState) return null;

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen()}
        as="div"
        className="relative z-10"
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded bg-white p-4 text-left align-middle shadow-xl transition-all">
                <form
                  className="flex flex-col gap-4"
                  onSubmit={(e) => {
                    e.preventDefault();

                    if (
                      employee.id === employeeState.id &&
                      employee.email === employeeState.email &&
                      employee.first_name === employeeState.first_name &&
                      employee.last_name === employeeState.last_name &&
                      employee.password === employeeState.password
                    ) {
                      return;
                    }

                    void (async () => {
                      await editEmployeeMutation.mutateAsync({
                        id: employeeState.id,
                        email: employeeState.email,
                        first_name: employeeState.first_name,
                        last_name: employeeState.last_name,
                        password: employeeState.password,
                      });

                      refetch();

                      setIsOpen();
                    })();
                  }}
                >
                  <h3 className="text-center text-lg font-bold">
                    Create Employee
                  </h3>
                  <div className="flex flex-col gap-x-2 text-left">
                    <label htmlFor="edit-unique-id-number" className="text-sm">
                      Unique ID Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      id="edit-unique-id-number"
                      className="flex-1"
                      value={employeeState.id}
                      placeholder="e.g. 123456789"
                      onChange={(e) => {
                        setEmployeeState({
                          ...employeeState,
                          id: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="flex gap-x-2">
                    <div className="text-left">
                      <label htmlFor="edit-first-name" className="text-sm">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        id="edit-first-name"
                        value={employeeState.first_name}
                        placeholder="e.g. Juan"
                        className="w-full"
                        onChange={(e) => {
                          setEmployeeState({
                            ...employeeState,
                            first_name: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className="text-left">
                      <label htmlFor="edit-last-name" className="text-sm">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        id="edit-last-name"
                        value={employeeState.last_name}
                        placeholder="e.g. Dela Cruz"
                        className="w-full"
                        onChange={(e) => {
                          setEmployeeState({
                            ...employeeState,
                            last_name: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-x-2 text-left">
                    <label htmlFor="edit-email" className="text-sm">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      id="edit-email"
                      className="flex-1"
                      value={employeeState.email}
                      placeholder="e.g. juan.delacruz@cvsu.edu.ph"
                      onChange={(e) => {
                        setEmployeeState({
                          ...employeeState,
                          email: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-x-2 text-left">
                    <label htmlFor="edit-password" className="text-sm">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="password"
                      id="edit-password"
                      className="flex-1"
                      value={employeeState.password}
                      placeholder="********"
                      onChange={(e) => {
                        setEmployeeState({
                          ...employeeState,
                          password: e.target.value,
                        });
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="button"
                    disabled={
                      editEmployeeMutation.isLoading ||
                      (employee.id === employeeState.id &&
                        employee.email === employeeState.email &&
                        employee.first_name === employeeState.first_name &&
                        employee.last_name === employeeState.last_name &&
                        employee.password === employeeState.password)
                    }
                  >
                    {editEmployeeMutation.isLoading ? "Loading..." : "Edit"}
                  </button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditEmployeeModal;
