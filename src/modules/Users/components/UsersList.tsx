import React, { useCallback, useState } from "react";

import Table from "react-bootstrap/Table";

import {
  faBan,
  faChevronLeft,
  faChevronRight,
  faCircleCheck,
  faEllipsisVertical,
  faEye,
  faFilter,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useGetData from "../../../hooks/useGetData";
import Spinner from "../../Shared/components/Spinner/Spinner";
import NoData from "../../Shared/components/NoData/NoData";
import { UsersAPI } from "../../../api";
import ViewModal from "../../Shared/components/VIewModal/ViewModal";

interface User {
  id: number;
  userName: string;
  email: string;
  phoneNumber: string;
  isActivated: boolean;
  creationDate: string;
  country: string;
}

interface PaginatedResponse {
  pageNumber: number;
  pageSize: number;
  totalNumberOfRecords: number;
  totalNumberOfPages: number;
  data: User[];
}

export default function UsersList() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [searchValue, setSearchValue] = useState("");
  const [showView, setShowView] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleViewShow = (user: User) => {
    setSelectedUser(user);
    setShowView(true);
  };
  const handleViewClose = () => setShowView(false);

  const fetchUsers = useCallback(() => {
    return UsersAPI.GetEmployeesByManager({page: currentPage,size: searchValue ? 1000 : pageSize, groups: 2});
  }, [currentPage, pageSize, searchValue]);

  const {data: paginationWrapper,isLoading,refetch} = useGetData<PaginatedResponse>
  (
    fetchUsers
    ,[currentPage,pageSize,searchValue]
  );

  const allUsers = paginationWrapper?.data || [];

  // SEARCH FILTER
  const filteredUsers = allUsers.filter(
    (user) =>
      user.userName.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.phoneNumber.includes(searchValue),
  );

  // NORMAL PAGINATION IF NO SEARCH
  const users = searchValue ? filteredUsers : allUsers;

  const totalResults = searchValue
    ? filteredUsers.length
    : paginationWrapper?.totalNumberOfRecords || 0;

  const totalPages = searchValue
    ? 1
    : paginationWrapper?.totalNumberOfPages || 1;

  // TOGGLE ACTIVATE

  const toggleActivate = async (id: number) => {
    try {
      await UsersAPI.ToggleActivate(id);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  // PAGINATION
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="d-flex flex-column h-100">
      {/* HEADER */}
      <div className="users-list-header d-flex justify-content-between align-items-center p-4 flex-shrink-0">
        <h3 style={{ color: "#0E382F"}}> Users </h3>
      </div>
      {/* CONTENT */}

      <div
        className="flex-grow-1 overflow-hidden py-3 px-4" style={{ backgroundColor: "#F5F5F5"}}>
        <div className="bg-white rounded-3 py-4 px-0 shadow-sm d-flex flex-column h-100" style={{minHeight: 0}}>
          {/* SEARCH */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4 px-4 flex-shrink-0">
            <div className="d-flex flex-column flex-sm-row gap-3 w-100">
              {/* SEARCH INPUT */}
              <div
                className="d-flex align-items-center px-3 rounded-pill"
                style={{border: "1px solid #D9D9D9",width: "100%",maxWidth: "320px",height: "45px"}}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                <input
                  type="text"
                  placeholder="Search Users"
                  className="border-0 ms-2 w-100"
                  style={{
                    outline: "none",
                  }}
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              {/* FILTER BUTTON */}
              <button
                className="btn rounded-pill px-4"
                style={{border: "1px solid #D9D9D9",height: "45px"}}>
                <FontAwesomeIcon icon={faFilter} className="me-2" /> Filter
              </button>
            </div>
          </div>
          {/* TABLE */}
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <div
                className="d-none d-md-block"
                style={{overflowY: "auto",flex: 1}}>
                <Table striped hover className="align-middle custom-table mb-0">
                  <thead
                    style={{position: "sticky",top: 0,backgroundColor: "#fff",zIndex: 1}}>
                    <tr>
                      <th>User Name</th>
                      <th>Status</th>
                      <th>Phone Number</th>
                      <th>Email</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.userName}</td>
                          <td>
                            <span
                              className="px-3 py-1 rounded-pill text-white small"
                              style={{
                                backgroundColor: user.isActivated
                                  ? "#198754"
                                  : "#C97A7A",
                              }}
                            >
                              {user.isActivated ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td>{user.phoneNumber}</td>
                          <td>{user.email}</td>
                          <td>
                            <div className="dropdown">
                              <button className="btn border-0" data-bs-toggle="dropdown" >
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                              </button>
                              <ul className="dropdown-menu border-0 shadow rounded-4">
                                <li>
                                  <button className="dropdown-item" onClick={() => toggleActivate(user.id)}>
                                    {user.isActivated ? (
                                      <>
                                        <FontAwesomeIcon color="red" icon={faBan} className="me-1" />Block
                                      </>
                                    ) : (
                                      <>
                                        <FontAwesomeIcon color="green" icon={faCircleCheck} className="me-1" /> Unblock
                                      </>
                                    )}
                                  </button>
                                </li>
                                <li>
                                  <button className="dropdown-item" onClick={()=> handleViewShow(user)}>
                                    <FontAwesomeIcon color="green" icon={faEye} className="me-1"/>View
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="no-data-row">
                          <NoData item="Users" />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
              {/* MOBILE GRID */}
              <div
                className="d-block d-md-none px-3 pb-3"
                style={{overflowY: "auto",flex: 1,minHeight: 0}} >
                <div className="row g-3">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <div key={user.id} className="col-12">
                        <div className="border rounded-4 p-3 shadow-sm grid-card">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <h5 className="mb-0" style={{ color: "#0E382F", }} >
                              {user.userName}
                            </h5>
                            <div className="dropdown">
                              <button className="btn border-0 p-0" data-bs-toggle="dropdown" >
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                              </button>
                              <ul className="dropdown-menu border-0 shadow rounded-4">
                                <li>
                                  <button className="dropdown-item" onClick={() => toggleActivate(user.id)}>
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
                                  <button className="dropdown-item" onClick={()=> handleViewShow(user)}>
                                    <FontAwesomeIcon color="green" icon={faEye} className="me-1"/>View
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="mb-2">
                            <span className="fw-bold">Status:</span>{" "}
                            <span
                              className="px-2 py-1 rounded-pill text-white small"
                              style={{
                                backgroundColor: user.isActivated
                                  ? "#198754"
                                  : "#C97A7A",
                              }}
                            >
                              {user.isActivated ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <div className="mb-2">
                            <span className="fw-bold">Phone:</span>{" "}
                            {user.phoneNumber}
                          </div>
                          <div>
                            <span className="fw-bold">Email:</span> {user.email}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <NoData item="Users" />
                  )}
                </div>
              </div>
            </>
          )}

          <ViewModal show={showView} handleClose={handleViewClose} title="Project Details"
            fields={[
              {label: "Username", value: selectedUser?.userName},
              {label: "email", value: selectedUser?.email},
              {label: "Activation", value: selectedUser?.isActivated? "Active" : "Not Active"},
              {label: "Phone Number", value:selectedUser?.phoneNumber},
              {label: "Country", value:selectedUser?.country},
              {label: "Joining Date", value:selectedUser?.creationDate? new Date(selectedUser?.creationDate).toLocaleDateString():"N/A"},
            ]}
          />


          {/* PAGINATION */}
          {!searchValue && totalResults > 5 && (
            <div className="custom-table-footer mt-4 px-3 flex-shrink-0">
              <div className="d-flex justify-content-center justify-content-md-end align-items-center flex-wrap gap-2">
                <span>Showing</span>
                <select
                  className="form-select rounded-pill"
                  style={{width: "85px"}}
                  value={pageSize}
                  onChange={handlePageSizeChange}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
                <span>of {totalResults} Results</span>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <div className="d-flex align-items-center gap-2">
                  <button
                    className="btn border-0 p-1"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    style={{opacity: currentPage === 1 ? 0.4 : 1}}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>

                  <button
                    className="btn border-0 p-1"
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages}
                    style={{opacity: currentPage >= totalPages ? 0.4 : 1}}
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}