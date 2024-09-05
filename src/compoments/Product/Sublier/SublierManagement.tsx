import React from 'react';
import './SublierManagement.css';
import {OverLay} from "../../OverLay/OverLay";

interface Supplier {
    id: number;
    name: string;
}

interface FormSupplierProps {
    handleClose: () => void;
    supplierId: number | null;
}

const FormSublier: React.FC<FormSupplierProps> = ({supplierId, handleClose}) => {

    const [supplierName, setSupplierName] = React.useState<string>('');

    const handleAdd = () => {
        console.log('Add supplier');
    }

    const handleUpdate = () => {
        console.log('Update supplier');
    }

    return (
        <div className="supplier-management-overlay">
            <button onClick={handleClose} className="button-close">
                <i className="fas fa-times"></i>
            </button>
            <p className="primary-label form-lable">{supplierId ? "Update Sublier" : "New Sublier"}</p>
            <form className={"form"}>
                <div className={"form-input-container"}>
                    <input
                        id={"supplier-name"}
                        type="text"
                        placeholder="Supplier name"
                        className="form-input"
                        required
                        value={supplierName}
                        onChange={(e) => setSupplierName(e.target.value)}
                    />
                </div>
                <button
                    onClick={supplierId ? handleUpdate : handleAdd}
                    className="form-input-submit"
                >
                    {supplierId ? "Update" : "Add"}
                </button>
            </form>
        </div>
    )
}

export const SublierManagement: React.FC = () => {

    const [suppliers, setSuppliers] = React.useState<Supplier[]>([
        {id: 1, name: 'Supplier A'},
        {id: 2, name: 'Supplier B'},
        {id: 3, name: 'Supplier C'},
    ]);
    const [showOverlay, setShowOverlay] = React.useState(false);
    const [sublierId, setSublierId] = React.useState<number | null>(null);

    const handleAdd = () => {
        setShowOverlay(true);
    }

    const handleClose = () => {
        setShowOverlay(false);
        setSublierId(null);
    }

    const handleDelete = (id: number) => {
        console.log(`Delete supplier with ID: ${id}`);
    };

    const sublierList = suppliers.map((supplier, index) => {
            return (
                <tr key={supplier.id}>
                    <td>{supplier.id}</td>
                    <td>{supplier.name}</td>
                    <td>
                        <button className="edit-button"
                                onClick={() => {
                                    setShowOverlay(true);
                                    setSublierId(supplier.id);
                                }}
                        >
                            Edit
                        </button>
                        <button className="delete-button"
                                onClick={() => handleDelete(supplier.id)}>Delete
                        </button>
                    </td>
                </tr>
            );
        }
    );

    return (
        <div className="container-right">
            <h1 className="primary-label">Sublier Management</h1>
            <p className="primary-description">Manage your suppliers here</p>
            <button onClick={handleAdd} className="add-button margin-top-button">Add Supplier</button>
            <table className="table id-column">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {sublierList}
                </tbody>
            </table>
            {
                showOverlay && <OverLay>
                    <FormSublier handleClose={handleClose} supplierId={sublierId}/>
                </OverLay>
            }
        </div>
    );
};
