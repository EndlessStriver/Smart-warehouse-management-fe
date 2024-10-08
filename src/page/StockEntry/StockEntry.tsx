import { Button, FormControl, FormSelect, Table } from "react-bootstrap";
import React from "react";
import Pagination from "../../compoments/Pagination/Pagination";
import { NoData } from "../../compoments/NoData/NoData";
import SpinnerLoading from "../../compoments/Loading/SpinnerLoading";
import PaginationType from "../../interface/Pagination";
import ReceiveHeader from "../../interface/Entity/ReceiveHeader";
import GetStockEntries from "../../services/StockEntry/GetStockEntries";
import { useDispatchMessage } from "../../Context/ContextMessage";
import ActionTypeEnum from "../../enum/ActionTypeEnum";
import FormEditStockEntry from "./compoments/FormEditStockEntry";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash, faUndo } from "@fortawesome/free-solid-svg-icons";
import RemoveStockEntry from "../../services/StockEntry/RemoveStockEntry";
import ModelConfirmDelete from "../../compoments/ModelConfirm/ModelConfirmDelete";

const TypeFind = ["Receive Code", "Receive By"];

const StockEntry: React.FC = () => {

    const dispatch = useDispatchMessage();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [stockEntry, setStockEntry] = React.useState<ReceiveHeader[]>([]);
    const [stockEntryId, setStockEntryId] = React.useState<string>("");
    const [showModelConfirmDelete, setShowModelConfirmDelete] = React.useState<boolean>(false);
    const [pagination, setPagination] = React.useState<PaginationType>({
        totalPage: 0,
        limit: 0,
        offset: 0,
        totalElementOfPage: 0
    });
    const [showFormEdit, setShowFormEdit] = React.useState<boolean>(false);
    const [loadingDelete, setLoadingDelete] = React.useState<boolean>(false);

    React.useEffect(() => {
        setIsLoading(true);
        GetStockEntries()
            .then((res) => {
                setStockEntry(res.data);
                setPagination({
                    totalPage: res.totalPage,
                    limit: res.limit,
                    offset: res.offset,
                    totalElementOfPage: res.totalElementOfPage
                });
            }).catch((err) => {
                dispatch({ type: ActionTypeEnum.ERROR, message: err.message });
            }).finally(() => {
                setIsLoading(false);
            })
    }, [dispatch]);

    React.useEffect(() => {

    }, [pagination.offset])

    const handleChangePage = (page: number) => {
        setPagination({ ...pagination, offset: page });
    }

    const handleDeleteStockEntry = (id: string) => {
        setLoadingDelete(true);
        RemoveStockEntry(id)
            .then(() => {
                dispatch({ type: ActionTypeEnum.SUCCESS, message: "Delete stock entry successfully" });
                setStockEntry(stockEntry.filter(item => item.id !== id));
                setStockEntryId("");
            }).catch((err) => {
                dispatch({ type: ActionTypeEnum.ERROR, message: err.message });
            }).finally(() => {
                setLoadingDelete(false);
            });
    }

    const renderTypeStatus = (status: string) => {
        switch (status) {
            case "PENDING":
                return <span className="badge text-bg-warning">{status}</span>;
            case "COMPLETED":
                return <span className="badge text-bg-success">{status}</span>;
            case "CANCELLED":
                return <span className="badge text-bg-danger">{status}</span>;
            default:
                return <span className="badge text-bg-primary">{status}</span>;
        }
    }

    const listStockEntry = stockEntry.map((item, index) => {
        return (
            <tr key={index} style={{ textAlign: "center" }}>
                <td>{index + 1}</td>
                <td>{item.receiveCode}</td>
                <td>{item.receiveDate}</td>
                <td>{item.receiveBy}</td>
                <td>{renderTypeStatus(item.status)}</td>
                <td>{item.description}</td>
                <td>{item.totalAmount}$</td>
                <td>
                    <div className="d-flex gap-2">
                        <Button onClick={() => {
                            setStockEntryId(item.id);
                            setShowFormEdit(true);
                        }} variant="primary text-light fw-bold">
                            <FontAwesomeIcon icon={faPencilAlt} />
                        </Button>

                        <Button onClick={() => {
                            setStockEntryId(item.id);
                            setShowModelConfirmDelete(true);
                        }} variant="danger text-light fw-bold">
                            <FontAwesomeIcon icon={faTrash} />
                        </Button>
                    </div>
                </td>
            </tr>
        );
    });

    const updateStockEntry = (response: ReceiveHeader[]) => {
        setStockEntry(response);
    }

    const updatePagination = (response: PaginationType) => {
        setPagination(response);
    }

    return (
        <div className={"w-100 h-100"}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h2 className={"h2 fw-bold"}>Stock Entry Management</h2>
                    <p className={"h6"}>Manage stock entry and their status</p>
                </div>
                <div className="d-flex flex-row gap-3">
                    <Button onClick={() => {
                        setShowFormEdit(true);
                    }} variant="info text-light fw-bold">+ NEW</Button>
                </div>
            </div>
            <div className={"d-flex flex-row gap-5 mb-3 justify-content-end"}>
                <div className={"d-flex flex-row gap-2"}>
                    <div style={{ width: "150px" }}>
                        <FormSelect>
                            {
                                TypeFind.map((type, index) => {
                                    return <option key={index} value={type}>{type}</option>
                                })
                            }
                        </FormSelect>
                    </div>
                    <FormControl type="text" placeholder="Search name..." style={{ width: "350px" }} />
                    <Button onClick={() => {
                    }}>
                        <FontAwesomeIcon icon={faUndo} />
                    </Button>
                </div>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr style={{ textAlign: "center" }}>
                        <th>#</th>
                        <th>Receive Code</th>
                        <th>Receive Date</th>
                        <th>Receive By</th>
                        <th>Status</th>
                        <th>Description</th>
                        <th>Total Amount</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {listStockEntry}
                </tbody>
            </Table>
            {
                stockEntry.length > 0 && <Pagination currentPage={pagination?.offset} totalPages={pagination?.totalPage}
                    onPageChange={handleChangePage} />
            }
            {
                (stockEntry.length === 0) && !isLoading && <NoData />
            }
            {
                isLoading && <SpinnerLoading />
            }
            {
                showFormEdit &&
                <FormEditStockEntry
                    handleClose={() => {
                        setShowFormEdit(false)
                        setStockEntryId("");
                    }}
                    stockEntryId={stockEntryId}
                    updateStockEntry={updateStockEntry}
                    updatePagination={updatePagination}
                />
            }
            {
                showModelConfirmDelete &&
                <ModelConfirmDelete
                    message="Are you sure want to delete this stock entry?"
                    onClose={() => {
                        setShowModelConfirmDelete(false)
                        setStockEntryId("");
                    }}
                    onConfirm={() => {
                        handleDeleteStockEntry(stockEntryId);
                        setShowModelConfirmDelete(false);
                    }}
                    loading={loadingDelete}
                />
            }
        </div>
    );
}

export default StockEntry;