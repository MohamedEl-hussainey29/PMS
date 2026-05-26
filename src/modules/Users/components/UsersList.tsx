import React, { useCallback, useState } from "react";
import Table from "react-bootstrap/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faChevronLeft,
  faChevronRight,
  faFilter,
  faEye,
  faBan,
} from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import useGetData from "../../../hooks/useGetData";
import { UsersAPI } from "../../../api";
import NoData from "../../Shared/components/NoData/NoData";
import Spinner from "../../Shared/components/Spinner/Spinner";

interface User {
  id: number;
  userName: string;
  isActivated: boolean;
  phoneNumber: string;
  email: string;
}

interface PaginatedResponse {
  pageNumber: number;
  pageSize: number;
  data: User[];
  totalNumberOfRecords: number;
  totalNumberOfPages: number;
}

export default function UsersList() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const fetchUsers = useCallback(() => {
    return UsersAPI.GetEmployeesByManager({ page: currentPage, size: pageSize, groups: 2 });
  }, [currentPage, pageSize]);

  const { data: paginationWrapper, isLoading, refetch } = useGetData<PaginatedResponse>(
    fetchUsers,
    [currentPage, pageSize]
  );

  const users = paginationWrapper?.data || [];
  const totalResults = paginationWrapper?.totalNumberOfRecords || 0;
  const totalPages = paginationWrapper?.totalNumberOfPages || 1;

  const toggleActivate = async (id: number) => {
    try {
      await UsersAPI.ToggleActivate(id);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="d-flex flex-column h-100">

      {/* Page Header */}
      <div className="users-list-header p-4 flex-shrink-0">
        <h3 style={{ color: "#0E382F" }}>Users</h3>
      </div>

      {/* Main Content */}
      <div
        className="flex-grow-1 overflow-hidden py-4 px-4"
        style={{ backgroundColor: "#F5F5F5" }}
      >
        <div className="bg-white rounded-3 py-4 px-0 shadow-sm d-flex flex-column h-100">

          {/* Search & Filter */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4 px-4 flex-shrink-0">
            <div className="d-flex flex-column flex-sm-row gap-3 w-100 w-md-auto">
              <div
                className="d-flex align-items-center px-3 rounded-pill"
                style={{
                  border: "1px solid #D9D9D9",
                  width: "100%",
                  maxWidth: "320px",
                  height: "45px",
                }}
              >
                <i className="fa-solid fa-magnifying-glass text-secondary"></i>
                <input
                  type="text"
                  placeholder="Search Users"
                  className="border-0 ms-2 w-100"
                  style={{ outline: "none" }}
                />
              </div>
              <button
                className="btn rounded-pill px-4"
                style={{ border: "1px solid #D9D9D9", height: "45px" }}
              >
                <FontAwesomeIcon icon={faFilter} className="me-2" />
                Filter
              </button>
            </div>
          </div>

          {/* Table */}
          {isLoading ? (
            <Spinner />
          ) : (
            <div style={{ overflowY: "auto", flex: 1 }}>
              <Table striped hover className="align-middle custom-table mb-0">
                <thead
                  style={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#fff",
                    zIndex: 1,
                  }}
                >
                  <tr>
                    <th>User Name</th>
                    <th>Status</th>
                    <th>Phone Number</th>
                    <th>Email</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {totalResults > 0 ? (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.userName}</td>
                        <td>
                          <span
                            className="px-3 py-1 rounded-pill text-white small"
                            style={{
                              backgroundColor: user.isActivated ? "#198754" : "#C97A7A",
                            }}
                          >
                            {user.isActivated ? "Active" : "Not Active"}
                          </span>
                        </td>
                        <td>{user.phoneNumber}</td>
                        <td>{user.email}</td>
                        <td>
                          <div className="dropdown">
                            <button className="btn border-0" data-bs-toggle="dropdown">
                              <FontAwesomeIcon icon={faEllipsisVertical} />
                            </button>
                            <ul className="dropdown-menu border-0 shadow rounded-4">
                              <li onClick={() => toggleActivate(user.id)}>
                                <button className="dropdown-item">
                                  {user.isActivated ? (
                                    <>
                                      <FontAwesomeIcon color="red" icon={faBan} className="me-1" /> Block
                                    </>
                                  ) : (
                                    <>
                                      <FontAwesomeIcon color="green" icon={faCircleCheck} className="me-1" /> Unblock
                                    </>
                                  )}
                                </button>
                              </li>
                              <li>
                                <button className="dropdown-item">
                                  <FontAwesomeIcon color="green" icon={faEye} className="me-1" /> View
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="no-data-row">
                        <NoData />
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          <div
            className="custom-table-footer mt-4 px-3 flex-shrink-0"
            style={{ display: totalResults <= 5 ? "none" : "block" }}
          >
            <div className="d-flex justify-content-center justify-content-md-end align-items-center flex-wrap gap-2">
              <span>Showing</span>
              <select
                className="form-select rounded-pill"
                style={{ width: "85px" }}
                value={pageSize}
                onChange={handlePageSizeChange}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <span>of {totalResults} Results</span>
              <span>Page {currentPage} of {totalPages}</span>
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn border-0 p-1"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  style={{ opacity: currentPage === 1 ? 0.4 : 1 }}
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button
                  className="btn border-0 p-1"
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                  style={{ opacity: currentPage >= totalPages ? 0.4 : 1 }}
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}