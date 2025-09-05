import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "../components/Layout";
import { SEOHelmet } from "../components/SEOHelmet";
import { useApi } from "../hooks/useApi";
import { useNotification } from "../contexts/NotificationContext";
import axios from "axios";

const AddEditProduct = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { apiCall } = useApi();
  const { showSuccess, showError } = useNotification();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Tops",
    price: "",
    discountPrice: "",
    stock: "",
    sizes: [{ size: "", stock: "" }],
    colors: [""],
    tags: [""],
    images: [],
    isActive: true,
    featured: false,
    brand: "",
    sku: "",
    weight: "",
    dimensions: "",
    material: "",
    warranty: "",
    gender: "Everyone",
  });

  const [loading, setLoading] = useState(false);

  /** Load product for edit */
  useEffect(() => {
    if (isEdit) loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const res = await apiCall(`/products/${id}`);
      const p = res.data;
      setFormData({
        ...formData,
        name: p.name,
        description: p.description,
        category: p.category,
        price: p.price.toString(),
        discountPrice: p.discountPrice?.toString() || "",
        stock: p.stock.toString(),
        sizes: p.sizes.length ? p.sizes : [{ size: "", stock: "" }],
        colors: p.colors.length ? p.colors : [""],
        tags: p.tags.length ? p.tags : [""],
        images: (p.images || []).map((img) => ({
          url: typeof img === "string" ? img : img.url,
          public_id: typeof img === "object" ? img.public_id : undefined,
        })),
        isActive: p.isActive,
        featured: p.featured,
        brand: p.brand || "",
        sku: p.sku || "",
        weight: p.weight || "",
        dimensions: p.dimensions || "",
        material: p.material || "",
        warranty: p.warranty || "",
        gender: p.gender || "Everyone",
      });
    } catch (error) {
      showError("Failed to load product");
    }
  };

  /** File Input & Image Handling */
  const triggerFileInput = () => fileInputRef.current.click();

  const handleFiles = (files) => {
    const newImages = Array.from(files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...newImages] }));
  };

  const removeImage = async (idx) => {
    const img = formData.images[idx];
    if (img.public_id) {
      try {
        await apiCall("/delete-image", {
          method: "DELETE",
          data: { public_id: img.public_id },
        });
        showSuccess("Image removed from Cloudinary");
      } catch (err) {
        showError("Failed to remove image from Cloudinary");
        return;
      }
    }
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  const uploadImageToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("folder", "Products");
    data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      data
    );

    return { url: res.data.secure_url, public_id: res.data.public_id };
  };

  /** Submit Form */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const uploadedImages = await Promise.all(
        formData.images.map(async (img) => {
          if (img.file) return await uploadImageToCloudinary(img.file);
          return img;
        })
      );

      const productData = {
        ...formData,
        images: uploadedImages,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
        stock: parseInt(formData.stock),
      };

      if (isEdit) {
        await apiCall(`/products/${id}`, { method: "PUT", data: productData });
        showSuccess("Product updated successfully");
      } else {
        await apiCall("/products", { method: "POST", data: productData });
        showSuccess("Product created successfully");
      }

      navigate("/products");
    } catch (error) {
      showError(error.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  /** Sizes Handling */
  const updateSize = (index, field, value) => {
    const newSizes = [...formData.sizes];
    newSizes[index][field] = field === "stock" ? parseInt(value) : value;
    setFormData({ ...formData, sizes: newSizes });
  };
  const addSize = () =>
    setFormData({
      ...formData,
      sizes: [...formData.sizes, { size: "", stock: "" }],
    });
  const removeSize = (idx) =>
    setFormData({
      ...formData,
      sizes: formData.sizes.filter((_, i) => i !== idx),
    });

  /** Colors & Tags */
  const updateArrayField = (field, idx, value) => {
    const arr = [...formData[field]];
    arr[idx] = value;
    setFormData({ ...formData, [field]: arr });
  };
  const addArrayItem = (field) =>
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  const removeArrayItem = (field, idx) =>
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== idx),
    });

  return (
    <>
      <SEOHelmet title={`${isEdit ? "Edit" : "Add"} Product`} description="Manage product" />
      <Layout>
        <div className="max-w-3xl mx-auto py-6 space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? "Edit Product" : "Add New Product"}</h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-6 rounded-xl shadow border border-neutral-200"
          >
            {/* Name & Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-0 focus:ring-primary-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-0 focus:ring-primary-400"
                required
              />
            </div>

            {/* Brand, SKU, Category */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-0 focus:ring-primary-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU / Product Code</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-0 focus:ring-primary-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-0 focus:ring-primary-400"
                >
                  <option value="Tops">Tops</option>
                  <option value="Bottoms">Bottoms</option>
                  <option value="Dresses">Dresses</option>
                  <option value="Outerwear">Outerwear</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Shoes">Shoes</option>
                </select>
              </div>
            </div>

            {/* Price, Discount, Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-0 focus:ring-primary-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount / Sale Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.discountPrice}
                  onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-0 focus:ring-primary-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-0 focus:ring-primary-400"
                  required
                />
              </div>
            </div>

            {/* Weight, Dimensions, Material */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                <input
                  type="text"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-0 focus:ring-primary-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
                <input
                  type="text"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-0 focus:ring-primary-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                <input
                  type="text"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-0 focus:ring-primary-400"
                />
              </div>
            </div>

            {/* Warranty, Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Warranty Period</label>
                <input
                  type="text"
                  value={formData.warranty}
                  onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-0 focus:ring-primary-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender / Target Audience</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-0 focus:ring-primary-400"
                >
                  <option value="Everyone">Everyone</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                </select>
              </div>
            </div>

            {/* Sizes, Colors, Tags */}
            <div className="space-y-6">
              {/* Sizes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {formData.sizes.map((s, idx) => (
                    <div key={idx} className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 space-x-1">
                      <input
                        type="text"
                        placeholder="Size"
                        value={s.size}
                        onChange={(e) => updateSize(idx, "size", e.target.value)}
                        className="w-16 px-1 py-0.5 border border-gray-300 rounded focus:ring-0 focus:ring-primary-400"
                      />
                      <input
                        type="number"
                        placeholder="Stock"
                        value={s.stock}
                        onChange={(e) => updateSize(idx, "stock", e.target.value)}
                        className="w-20 px-1 py-0.5 border border-gray-300 rounded focus:ring-0 focus:ring-primary-400"
                      />
                      <button
                        type="button"
                        onClick={() => removeSize(idx)}
                        className="text-red-500 hover:text-red-700 font-bold px-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSize}
                    className="flex items-center justify-center px-3 py-1 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors text-sm font-medium"
                  >
                    + Add Size
                  </button>
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
                <div className="flex flex-wrap gap-2">
                  {formData.colors.map((c, idx) => (
                    <div key={idx} className="flex items-center bg-gray-50 border border-gray-200 px-2 py-1 space-x-1">
                      <input
                        type="text"
                        value={c}
                        onChange={(e) => updateArrayField("colors", idx, e.target.value)}
                        placeholder="Color"
                        className="w-20 px-1 py-0.5 border border-gray-300 focus:ring-0 focus:ring-primary-400"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem("colors", idx)}
                        className="text-red-500 hover:text-red-700 font-bold px-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem("colors")}
                    className="flex items-center justify-center px-3 py-1 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors text-sm font-medium"
                  >
                    + Add Color
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((t, idx) => (
                    <div key={idx} className="flex items-center bg-gray-50 border border-gray-200 px-2 py-1 space-x-1">
                      <input
                        type="text"
                        value={t}
                        onChange={(e) => updateArrayField("tags", idx, e.target.value)}
                        placeholder="Tag"
                        className="w-20 px-1 py-0.5 border border-gray-300 focus:ring-0 focus:ring-primary-400"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem("tags", idx)}
                        className="text-red-500 hover:text-red-700 font-bold px-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem("tags")}
                    className="flex items-center justify-center px-3 py-1 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors text-sm font-medium"
                  >
                    + Add Tag
                  </button>
                </div>
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
              <div
                onDrop={(e) => {
                  e.preventDefault();
                  handleFiles(e.dataTransfer.files);
                }}
                onDragOver={(e) => e.preventDefault()}
                onClick={triggerFileInput}
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 py-16 cursor-pointer hover:border-primary-400 transition-colors duration-200"
              >
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
                <p className="text-gray-500 text-sm">Drag & drop images here, or click to select files</p>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative w-24 h-24 border rounded-lg overflow-hidden">
                    <img src={img.url} alt="product" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Flags */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                <span className="text-sm text-gray-700">Featured</span>
              </label>
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary-400 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-500 transition-all duration-200"
              >
                {loading ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      </Layout>
    </>
  );
};

export default AddEditProduct;
