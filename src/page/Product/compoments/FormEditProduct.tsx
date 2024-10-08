import React from "react";
import { OverLay } from "../../../compoments/OverLay/OverLay";
import { Button, CloseButton, Col, Container, Form, Image, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faEdit, faImage, faImages } from "@fortawesome/free-solid-svg-icons";
import Select from 'react-select';
import GetSizesByName from "../../../services/Attribute/Size/GetSizesByName";
import GetColorsByName from "../../../services/Attribute/Color/GetColorsByName";
import GetBrandsByName from "../../../services/Attribute/Brand/GetBrandsByName";
import GetMaterialsByName from "../../../services/Attribute/Material/GetMaterialsByName";
import GetCategoriesByName from "../../../services/Attribute/Category/GetCategoriesByName";
import GetSuppliersByName from "../../../services/Supplier/GetSuppliersByName";
import DataTypeCreateProductAdmin from "../../../interface/PageProduct/DataTypeCreateProductAdmin";
import CreateProduct from "../../../services/Product/CreateProduct";
import { useDispatchMessage } from "../../../Context/ContextMessage";
import ActionTypeEnum from "../../../enum/ActionTypeEnum";
import GetProductById from "../../../services/Product/GetProductById";
import SpinnerLoadingOverLay from "../../../compoments/Loading/SpinnerLoadingOverLay";
import { Product } from "../../../interface/Entity/Product";
import DeepEqual from "../../../util/DeepEqual";
import DataTypeUpdateProductAdmin from "../../../interface/PageProduct/DataTypeUpdateProductAdmin";
import UpdateProductByProductId from "../../../services/Product/UpdateProductByProductId";
import DeleteImageByProductId from "../../../services/Product/DeleteImageByProductId";
import ModelConfirmDelete from "../../../compoments/ModelConfirm/ModelConfirmDelete";
import '../css/FormEditProduct.css'
import AddImagesProduct from "../../../services/Product/AddImagesProduct";
import OptionType from "../../../interface/OptionType";

interface FormEditProductProps {
    handleClose: () => void;
    productId?: string;
}

interface FormDataType {
    name: string;
    description: string;
    unit: string;
    weight: string;
    productCode: string;
    length: string;
    width: string;
    height: string;
    color: OptionType | null;
    branch: OptionType | null;
    model: OptionType | null;
    size: OptionType | null;
    category: OptionType | null;
    supplier: OptionType | null;
}

interface TypeImagePreview {
    key: string,
    url: string
}

interface TypeImageUpload {
    key: string,
    file: File
}

const Utils: string[] = ["kg", "g", "l", "ml", "unit", "box", "carton"];

const FormEditProduct: React.FC<FormEditProductProps> = ({ productId, handleClose }) => {

    const dispatch = useDispatchMessage();
    const uploadRef = React.useRef<HTMLInputElement>(null);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [showModelConfirmDeleteImage, setShowModelConfirmDeleteImage] = React.useState<boolean>(false);
    const [isEdit, setIsEdit] = React.useState<boolean>(false);
    const [reload, setReload] = React.useState<boolean>(false);

    const [keyImageDelete, setKeyImageDelete] = React.useState<string>("");

    const [color, setColor] = React.useState<string>("");
    const [branch, setBranch] = React.useState<string>("");
    const [model, setModel] = React.useState<string>("");
    const [size, setSize] = React.useState<string>("");
    const [category, setCategory] = React.useState<string>("");
    const [supplier, setSupplier] = React.useState<string>("");
    const [images, setImages] = React.useState<TypeImageUpload[]>([]);
    const [imagePreviewsDefault, setImagePreviewsDefault] = React.useState<TypeImagePreview[]>([]);
    const [imagePreviews, setImagePreviews] = React.useState<TypeImagePreview[]>([]);

    const [colors, setColors] = React.useState<OptionType[]>([]);
    const [branches, setBranches] = React.useState<OptionType[]>([]);
    const [models, setModels] = React.useState<OptionType[]>([]);
    const [sizes, setSizes] = React.useState<OptionType[]>([]);
    const [categories, setCategories] = React.useState<OptionType[]>([]);
    const [suppliers, setSuppliers] = React.useState<OptionType[]>([]);

    const [dataDefault, setDataDefault] = React.useState<FormDataType>({
        name: "",
        description: "",
        unit: "",
        weight: "",
        productCode: "",
        length: "",
        width: "",
        height: "",
        color: null,
        branch: null,
        model: null,
        size: null,
        category: null,
        supplier: null,
    });
    const [formData, setFormData] = React.useState<FormDataType>({
        name: "",
        description: "",
        unit: "",
        weight: "",
        productCode: "",
        length: "",
        width: "",
        height: "",
        color: null,
        branch: null,
        model: null,
        size: null,
        category: null,
        supplier: null,
    })

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const FormatDataGet = (data: Product): FormDataType => {
        return {
            name: data.name,
            description: data.description,
            unit: data.unit,
            weight: data.productDetails!.sku.weight.toString(),
            productCode: data.productCode,
            length: data.productDetails!.sku.dimension.split("x")[0],
            width: data.productDetails!.sku.dimension.split("x")[1],
            height: data.productDetails!.sku.dimension.split("x")[2],
            color: { value: data.productDetails!.sku.color.id, label: data.productDetails!.sku.color.name },
            branch: {
                value: data.productDetails!.sku.brand.id,
                label: data!.productDetails!.sku.brand.name
            },
            model: {
                value: data.productDetails!.sku.material.id,
                label: data.productDetails!.sku.material.name
            },
            size: { value: data.productDetails!.sku.size.id, label: data.productDetails!.sku.size.name },
            category: { value: data.category!.id, label: data.category!.name },
            supplier: { value: data.productDetails!.supplier.id, label: data.productDetails!.supplier.name },
        }
    }

    const validate1 = (): boolean => {
        if (formData.name === "") {
            dispatch({ type: ActionTypeEnum.ERROR, message: "Name is required" });
            return true;
        }
        if (formData.description === "") {
            dispatch({ type: ActionTypeEnum.ERROR, message: "Description is required" });
            return true;
        }
        if (formData.unit === "") {
            dispatch({ type: ActionTypeEnum.ERROR, message: "Unit is required" });
            return true;
        }
        if (formData.weight === "") {
            dispatch({ type: ActionTypeEnum.ERROR, message: "Weight is required" });
            return true;
        }
        if (formData.productCode === "") {
            dispatch({ type: ActionTypeEnum.ERROR, message: "Product code is required" });
            return true;
        }
        if (formData.length === "") {
            dispatch({ type: ActionTypeEnum.ERROR, message: "Length is required" });
            return true;
        }
        if (formData.width === "") {
            dispatch({ type: ActionTypeEnum.ERROR, message: "Width is required" });
            return true;
        }
        if (formData.height === "") {
            dispatch({ type: ActionTypeEnum.ERROR, message: "Height is required" });
            return true;
        }
        if (formData.color === null) {
            dispatch({ type: ActionTypeEnum.ERROR, message: "Color is required" });
            return true;
        }
        if (formData.branch === null) {
            dispatch({ type: ActionTypeEnum.ERROR, message: "Branch is required" });
            return true;
        }
        if (formData.model === null) {
            dispatch({ type: ActionTypeEnum.ERROR, message: "Model is required" });
            return true;
        }
        if (formData.size === null) {
            dispatch({ type: ActionTypeEnum.ERROR, message: "Size is required" });
            return true;
        }
        if (formData.category === null) {
            dispatch({ type: ActionTypeEnum.ERROR, message: "Category is required" });
            return true;
        }
        if (formData.supplier === null) {
            dispatch({ type: ActionTypeEnum.ERROR, message: "Supplier is required" });
            return true;
        }
        return false;
    }

    const CheckDataChange = (): boolean => {
        let isChange = false;
        Object.keys(formData).forEach((key) => {
            if ((typeof formData[key as keyof FormDataType] === "object") && (typeof dataDefault[key as keyof FormDataType] === "object")) {
                if (!DeepEqual(formData[key as keyof FormDataType], dataDefault[key as keyof FormDataType])) isChange = true;
            } else {
                if (formData[key as keyof FormDataType] !== dataDefault[key as keyof FormDataType]) isChange = true;
            }
        });
        return isChange;
    }

    React.useEffect(() => {
        if (productId) {
            GetProductById(productId)
                .then((data) => {
                    setFormData(FormatDataGet(data));
                    setDataDefault(FormatDataGet(data));
                    setImagePreviews(data.productDetails?.images.map((image) => {
                        return {
                            key: crypto.randomUUID().toString(),
                            url: image.url
                        }
                    }) || []);
                    setImagePreviewsDefault(data.productDetails?.images.map((image) => {
                        return {
                            key: crypto.randomUUID().toString(),
                            url: image.url
                        }
                    }) || []);
                }).catch((error) => {
                    dispatch({ type: ActionTypeEnum.ERROR, message: error.message });
                }).finally(() => {
                    setLoading(false);
                })
        }
    }, [productId, dispatch, reload])

    React.useEffect(() => {
        const id = setTimeout(() => {
            GetColorsByName(color)
                .then((data) => {
                    setColors(data.map((size) => ({ value: size.id, label: size.name })));
                })
                .catch((error) => {
                    dispatch({ type: ActionTypeEnum.ERROR, message: error.message });
                });
        }, 500);
        return () => clearTimeout(id);
    }, [color, dispatch]);

    React.useEffect(() => {
        const id = setTimeout(() => {
            GetBrandsByName(branch)
                .then((data) => {
                    setBranches(data.map((size) => ({ value: size.id, label: size.name })));
                })
                .catch((error) => {
                    dispatch({ type: ActionTypeEnum.ERROR, message: error.message });
                });
        }, 500);
        return () => clearTimeout(id);
    }, [branch, dispatch]);

    React.useEffect(() => {
        const id = setTimeout(() => {
            GetMaterialsByName(model)
                .then((data) => {
                    setModels(data.map((size) => ({ value: size.id, label: size.name })));
                })
                .catch((error) => {
                    dispatch({ type: ActionTypeEnum.ERROR, message: error.message });
                });
        }, 500);
        return () => clearTimeout(id);
    }, [model, dispatch]);

    React.useEffect(() => {
        const id = setTimeout(() => {
            GetSizesByName(size)
                .then((data) => {
                    setSizes(data.map((size) => ({ value: size.id, label: size.name })));
                })
                .catch((error) => {
                    dispatch({ type: ActionTypeEnum.ERROR, message: error.message });
                });
        }, 500);
        return () => clearTimeout(id);
    }, [size, dispatch]);

    React.useEffect(() => {
        const id = setTimeout(() => {
            GetCategoriesByName(category)
                .then((data) => {
                    setCategories(data.map((size) => ({ value: size.id, label: size.name })));
                })
                .catch((error) => {
                    dispatch({ type: ActionTypeEnum.ERROR, message: error.message });
                });
        }, 500);
        return () => clearTimeout(id);
    }, [category, dispatch]);

    React.useEffect(() => {
        const id = setTimeout(() => {
            GetSuppliersByName(supplier)
                .then((data) => {
                    setSuppliers(data.map((size) => ({ value: size.id, label: size.name })));
                })
                .catch((error) => {
                    dispatch({ type: ActionTypeEnum.ERROR, message: error.message });
                });
        }, 500);
        return () => clearTimeout(id);
    }, [supplier, dispatch]);

    const getListImage = (): File[] => {
        return images.map((image) => image.file);
    }

    const formatDataCreate = (): DataTypeCreateProductAdmin => {
        return {
            name: formData.name,
            unit: formData.unit,
            categoryId: formData.category!.value,
            description: formData.description,
            productCode: formData.productCode,
            supplierId: formData.supplier!.value,
            colorId: formData.color!.value,
            sizeId: formData.size!.value,
            materialId: formData.model!.value,
            brandId: formData.branch!.value,
            dimension: `${formData.length}x${formData.width}x${formData.height}`,
            weight: Number(formData.weight),
            image: getListImage(),
        }
    }

    const formatDataUpdate = (): DataTypeUpdateProductAdmin => {

        const dataUpdate: DataTypeUpdateProductAdmin = {
            name: formData.name,
            unit: formData.unit,
            categoryId: formData.category!.value,
            description: formData.description,
            productCode: formData.productCode,
            supplierId: formData.supplier!.value,
            colorId: formData.color!.value,
            sizeId: formData.size!.value,
            materialId: formData.model!.value,
            brandId: formData.branch!.value,
            dimension: `${formData.length}x${formData.width}x${formData.height}`,
            weight: Number(formData.weight),
        }

        if (formData.name === dataDefault.name) delete dataUpdate.name;
        if (formData.unit === dataDefault.unit) delete dataUpdate.unit;
        if (DeepEqual(formData.category, dataDefault.category)) delete dataUpdate.categoryId;
        if (formData.description === dataDefault.description) delete dataUpdate.description;
        if (formData.productCode === dataDefault.productCode) delete dataUpdate.productCode;
        if (DeepEqual(formData.supplier, dataDefault.supplier)) delete dataUpdate.supplierId;
        if (DeepEqual(formData.color, dataDefault.color)) delete dataUpdate.colorId;
        if (DeepEqual(formData.size, dataDefault.size)) delete dataUpdate.sizeId;
        if (DeepEqual(formData.model, dataDefault.model)) delete dataUpdate.materialId;
        if (formData.length === dataDefault.length && formData.width === dataDefault.width && formData.height === dataDefault.height) delete dataUpdate.dimension;
        if (formData.weight === dataDefault.weight) delete dataUpdate.weight;

        return dataUpdate;
    }

    const handleSubmit = () => {
        if (validate1()) return;
        setLoading(true);
        if (!productId) {
            CreateProduct(formatDataCreate())
                .then(() => {
                    dispatch({ type: ActionTypeEnum.SUCCESS, message: "Create product success" });
                    setTimeout(() => {
                        handleClose();
                    }, 1000);
                })
                .catch((error) => {
                    dispatch({ type: ActionTypeEnum.ERROR, message: error.message });
                })
                .finally(() => {
                    setLoading(false);
                })
        } else {
            const dataUpdate = formatDataUpdate();
            if (Object.keys(dataUpdate).length === 0) {
                dispatch({ type: ActionTypeEnum.ERROR, message: "No data change" });
                setLoading(false);
            } else {
                UpdateProductByProductId(productId, dataUpdate)
                    .then((response) => {
                        setFormData(FormatDataGet(response));
                        setDataDefault(FormatDataGet(response));
                        dispatch({ type: ActionTypeEnum.SUCCESS, message: "Update product success" });
                        setIsEdit(false);
                    })
                    .catch((error) => {
                        dispatch({ type: ActionTypeEnum.ERROR, message: error.message });
                    })
                    .finally(() => {
                        setLoading(false);
                    })
            }
        }
    }

    const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files: FileList | null = e.target.files;
        const maxFileSize = 10 * 1024 * 1024;
        if (files !== null) {
            for (let i = 0; i < files.length; i++) {
                if (files[i].size > maxFileSize) {
                    dispatch({ type: ActionTypeEnum.ERROR, message: "Your file is more than 10MB" });
                    break;
                } else {
                    const keyRandom = crypto.randomUUID().toString();
                    imagePreviews.push({
                        key: keyRandom,
                        url: URL.createObjectURL(files[i])
                    });
                    setImages((preState) => {
                        return [...preState, { key: keyRandom, file: files[i] }];
                    });
                }
            }
        }
    }

    const handleRemoveImage = (key: string) => {
        if (productId) {
            const image = imagePreviews.find((image) => image.key === key);
            if (image) {
                setLoading(true);
                DeleteImageByProductId(productId, image.url)
                    .then(() => {
                        const newPreviews = imagePreviews.filter((image) => image.key !== key);
                        setImagePreviews(newPreviews);
                        setImagePreviewsDefault(newPreviews);
                    })
                    .catch((error) => {
                        dispatch({ type: ActionTypeEnum.ERROR, message: error.message });

                    }).finally(() => {
                        setLoading(false);
                    })
            } else {
                dispatch({ type: ActionTypeEnum.ERROR, message: "Image not found" });
            }
        } else {
            const newImages = images.filter((image) => image.key !== key);
            const newPreviews = imagePreviews.filter((image) => image.key !== key);
            setImages(newImages);
            setImagePreviews(newPreviews);
        }
    }

    const handleConfirmDeleteImage = () => {
        handleRemoveImage(keyImageDelete);
        setShowModelConfirmDeleteImage(false);
        setKeyImageDelete("");
    }

    const checkImageNew = (key: string): boolean => {
        let isNewImage = false;
        images.forEach((img) => {
            if (img.key === key) {
                isNewImage = true;
            }
        })
        return isNewImage;
    }

    const handleCheckImageChangeData = (): boolean => {
        return !DeepEqual(imagePreviews, imagePreviewsDefault);
    }

    const handleAddNewImage = () => {
        if (images.length > 0) {
            setLoading(true);
            AddImagesProduct(productId!, getListImage())
                .then(() => {
                    setReload(!reload);
                    setImages([]);
                    dispatch({ type: ActionTypeEnum.SUCCESS, message: "Add image success" });
                })
                .catch((error) => {
                    dispatch({ type: ActionTypeEnum.ERROR, message: error.message });
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            dispatch({ type: ActionTypeEnum.ERROR, message: "No image to add" });
        }
    };

    return (
        <OverLay className="disabled-padding bg-light p-4">
            <Container fluid className="h-100 w-100 position-relative shadow p-3 rounded">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex flex-row align-items-center gap-2">
                        <button
                            onClick={() => handleClose()}
                            className="btn fs-3 px-3 text-primary"
                        >
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <h2 className="fw-bold mb-0">{`${productId ? "Edit Product" : "New Product"}`}</h2>
                    </div>
                    {
                        productId ?
                            isEdit ?
                                <div className={"d-flex gap-2"}>
                                    <Button
                                        variant="primary"
                                        className="fw-semibold"
                                        onClick={() => {
                                            handleSubmit()
                                        }}
                                        disabled={!CheckDataChange()}
                                    >Save</Button>
                                    <Button
                                        variant="secondary"
                                        className="fw-semibold"
                                        onClick={() => {
                                            setIsEdit(false);
                                            setFormData(dataDefault);
                                            setImagePreviews(imagePreviewsDefault.map((image) => {
                                                return image;
                                            }));
                                            setImages([]);
                                        }}
                                    >Cancel</Button>
                                </div>
                                :
                                <Button
                                    variant="danger"
                                    className="fw-semibold"
                                    onClick={() => setIsEdit(true)}
                                >
                                    <FontAwesomeIcon icon={faEdit} className={"me-2"} />
                                    Edit
                                </Button>
                            :
                            <Button
                                variant="primary"
                                className="fw-semibold"
                                onClick={handleSubmit}
                            >Create</Button>
                    }
                </div>
                <Row className="px-4">
                    <Col md={6} className="p-3">
                        <h5 className="fw-semibold border-bottom pb-2 mb-3">Product Details</h5>
                        <Form.Group className="mb-3">
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter product name"
                                className="py-3"
                                name="name"
                                onChange={handleChangeInput}
                                required
                                disabled={productId !== "" && !isEdit}
                                value={formData.name}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <div className="d-flex flex-column">
                                <Form.Label>Description</Form.Label>
                                <textarea
                                    className="form-control py-3"
                                    placeholder="Enter description"
                                    cols={3}
                                    name="description"
                                    onChange={handleChangeInput}
                                    required
                                    disabled={productId !== "" && !isEdit}
                                    value={formData.description}
                                />
                            </div>
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Unit</Form.Label>
                                    <Form.Select
                                        className="py-3"
                                        name="unit"
                                        onChange={handleChangeInput}
                                        required
                                        value={formData.unit}
                                        disabled={productId !== "" && !isEdit}
                                    >
                                        <option value={""}>Select unit...</option>
                                        {Utils.map((unit) => (
                                            <option key={unit} value={unit}>{unit}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Weight</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter weight"
                                        className="py-3"
                                        name="weight"
                                        onChange={handleChangeInput}
                                        value={formData.weight}
                                        required
                                        disabled={productId !== "" && !isEdit}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Product Code</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter product code"
                                className="py-3"
                                name="productCode"
                                onChange={handleChangeInput}
                                required
                                value={formData.productCode}
                                disabled={productId !== "" && !isEdit}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Demension</Form.Label>
                            <div className="d-flex flex-row gap-3 align-items-center">
                                <Form.Control
                                    type="number"
                                    placeholder="Enter Lenght"
                                    className="py-3"
                                    name="length"
                                    onChange={handleChangeInput}
                                    value={formData.length}
                                    required
                                    disabled={productId !== "" && !isEdit}
                                />
                                <span>X</span>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter Width"
                                    className="py-3"
                                    name="width"
                                    onChange={handleChangeInput}
                                    value={formData.width}
                                    required
                                    disabled={productId !== "" && !isEdit}
                                />
                                <span>X</span>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter Height"
                                    className="py-3"
                                    name="height"
                                    onChange={handleChangeInput}
                                    value={formData.height}
                                    required
                                    disabled={productId !== "" && !isEdit}
                                />
                            </div>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Row className="p-3">
                            <h5 className="fw-semibold border-bottom pb-2 mb-3">Product Attributes</h5>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Color</Form.Label>
                                    <Select
                                        placeholder="Enter name color"
                                        isClearable
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                padding: "0.5rem 0px",
                                            }),
                                        }}
                                        onInputChange={setColor}
                                        value={formData.color}
                                        onChange={(value) => setFormData({ ...formData, color: value })}
                                        options={colors}
                                        required
                                        isDisabled={productId !== "" && !isEdit}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Model</Form.Label>
                                    <Select
                                        placeholder="Enter name model"
                                        isClearable
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                padding: "0.5rem 0px",
                                            }),
                                        }}
                                        onInputChange={setModel}
                                        value={formData.model}
                                        onChange={(value) => setFormData({ ...formData, model: value })}
                                        options={models}
                                        required
                                        isDisabled={productId !== "" && !isEdit}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Branch</Form.Label>
                                    <Select
                                        placeholder="Enter name branch"
                                        isClearable
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                padding: "0.5rem 0px",
                                            }),
                                        }}
                                        onInputChange={setBranch}
                                        value={formData.branch}
                                        onChange={(value) => setFormData({ ...formData, branch: value })}
                                        options={branches}
                                        required
                                        isDisabled={productId !== "" && !isEdit}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Size</Form.Label>
                                    <Select
                                        placeholder="Enter name size"
                                        isClearable
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                padding: "0.5rem 0px",
                                            }),
                                        }}
                                        onInputChange={setSize}
                                        value={formData.size}
                                        onChange={(value) => setFormData({ ...formData, size: value })}
                                        options={sizes}
                                        required
                                        isDisabled={productId !== "" && !isEdit}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="p-3">
                            <h5 className="fw-semibold border-bottom pb-2 mb-3">Classification And Supplier</h5>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Category</Form.Label>
                                    <Select
                                        placeholder="Enter name category"
                                        isClearable
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                padding: "0.5rem 0px",
                                            }),
                                        }}
                                        onInputChange={setCategory}
                                        value={formData.category}
                                        onChange={(value) => setFormData({ ...formData, category: value })}
                                        options={categories}
                                        required
                                        isDisabled={productId !== "" && !isEdit}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Supplier</Form.Label>
                                    <Select
                                        placeholder="Enter name supplier"
                                        isClearable
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                padding: "0.5rem 0px",
                                            }),
                                        }}
                                        onInputChange={setSupplier}
                                        value={formData.supplier}
                                        onChange={(value) => setFormData({ ...formData, supplier: value })}
                                        options={suppliers}
                                        required
                                        isDisabled={productId !== "" && !isEdit}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className="p-3">
                    <div className="border-bottom pb-2 mb-3 d-flex justify-content-between">
                        <h5 className="fw-semibold d-flex align-items-center">
                            <FontAwesomeIcon icon={faImages} className="me-2" />
                            Images
                        </h5>
                        <Button
                            variant="outline-primary"
                            className="fw-semibold"
                            onClick={() => {
                                uploadRef.current?.click()
                            }}
                            disabled={productId !== "" && !isEdit}
                        >+ Add Images</Button>
                    </div>
                    <Form.Group className="mb-3">
                        <Form.Control
                            ref={uploadRef}
                            type="file"
                            placeholder="Enter name supplier"
                            className="py-3 d-none"
                            multiple
                            onChange={handleChangeFile}
                            disabled={productId !== "" && !isEdit}
                            accept={"image/*"}
                        />
                    </Form.Group>
                    <div className="masonry mb-4">
                        {imagePreviews.map((image) => (
                            <div className="position-relative image-box" key={image.key}>
                                <Image
                                    src={image.url}
                                    alt="preview"
                                    thumbnail
                                />
                                <CloseButton
                                    className="position-absolute bg-light"
                                    onClick={() => {
                                        if (!productId) {
                                            handleRemoveImage(image.key)
                                        } else {
                                            setKeyImageDelete(image.key);
                                            if (checkImageNew(image.key)) {
                                                const newImages = images.filter((img) => img.key !== image.key);
                                                const newPreviews = imagePreviews.filter((img) => img.key !== image.key);
                                                setImages(newImages);
                                                setImagePreviews(newPreviews);
                                            } else {
                                                setShowModelConfirmDeleteImage(true);
                                            }
                                        }
                                    }}
                                    style={{ top: "0.5rem", right: "0.5rem" }}
                                    disabled={productId !== "" && !isEdit}
                                />
                                {
                                    checkImageNew(image.key) &&
                                    <span className="badge text-bg-danger position-absolute top-0 start-0">New</span>
                                }
                            </div>
                        ))}
                    </div>
                    {
                        imagePreviews.length === 0 &&
                        <div
                            className="d-flex flex-column align-items-center justify-content-center gap-2 text-secondary">
                            <FontAwesomeIcon icon={faImage} size="3x" />
                            <span>No images</span>
                        </div>
                    }
                    {
                        handleCheckImageChangeData() && images.length > 0 &&
                        <div className={"d-flex justify-content-end gap-2"}>
                            <div
                                onClick={handleAddNewImage}
                                className={"btn btn-primary"}
                            >
                                Upload
                            </div>
                            <div
                                onClick={() => {
                                    setImagePreviews(imagePreviewsDefault.map((image) => {
                                        return image;
                                    }));
                                    setImages([]);
                                }}
                                className={"btn btn-secondary"}
                            >
                                Cancel
                            </div>
                        </div>
                    }
                </Row>
            </Container>
            {
                loading && <SpinnerLoadingOverLay />
            }
            {
                showModelConfirmDeleteImage &&
                <ModelConfirmDelete
                    message={"Are you sure delete this image"}
                    onConfirm={handleConfirmDeleteImage}
                    onClose={() => {
                        setShowModelConfirmDeleteImage(false)
                        setKeyImageDelete("");
                    }}
                    loading={loading}
                />
            }
        </OverLay>
    )
}

export default FormEditProduct;