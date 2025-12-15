import React, { useState, useMemo } from "react";
import { useData } from "../contexts/DataContext";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import ModernModal from "../components/common/ModernModal";
import ConfirmationModal from "../components/common/ConfirmationModal";
import Input from "../components/common/Input";
import ModernSelect from "../components/common/ModernSelect";
import { Plus, Edit2, Trash2, FolderOpen } from "lucide-react";
import * as Icons from "lucide-react";
import { presetColors } from "../data/colors";
import { availableIcons } from "../data/icons";

const Categories = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useData();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [activeTab, setActiveTab] = useState("expense");
  const [formData, setFormData] = useState({
    name: "",
    type: "expense",
    icon: "FolderOpen",
    color: "#3b82f6",
    parentId: "", // For sub-categories
  });

  const filteredCategories = useMemo(() => {
    return categories.filter((c) => c.type === activeTab && !c.isDefault && !c.parentId);
  }, [categories, activeTab]);

  const subCategories = useMemo(() => {
    return categories.filter((c) => c.type === activeTab && !c.isDefault && c.parentId);
  }, [categories, activeTab]);

  const defaultCategories = useMemo(() => {
    return categories.filter((c) => c.type === activeTab && c.isDefault);
  }, [categories, activeTab]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingCategory) {
      updateCategory(editingCategory.id, formData);
    } else {
      addCategory({ ...formData, isDefault: false });
    }

    setShowModal(false);
    setEditingCategory(null);
    setFormData({
      name: "",
      type: "expense",
      icon: "FolderOpen",
      color: "#3b82f6",
      parentId: "",
    });
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      icon: category.icon,
      color: category.color,
      parentId: category.parentId || "",
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setCategoryToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete);
      setShowDeleteConfirm(false);
      setCategoryToDelete(null);
    }
  };

  const getIconComponent = (iconName) => {
    const IconComponent = Icons[iconName] || Icons.FolderOpen;
    return <IconComponent size={20} />;
  };

  const CategoryCard = ({ category, isDefault, isSubCategory = false }) => {
    const parentCategory = category.parentId ? categories.find((c) => c.id === category.parentId) : null;

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "var(--space-4)",
          background: isSubCategory ? "var(--primary-50)" : "var(--bg-secondary)",
          borderRadius: "var(--radius-lg)",
          border: isSubCategory ? "1px solid var(--primary-200)" : "1px solid var(--border-color)",
          marginLeft: isSubCategory ? "var(--space-3)" : 0,
          transition: "all var(--transition-fast)",
          _hover: {
            borderColor: "var(--primary-300)",
            boxShadow: "var(--shadow-sm)",
          },
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--primary-400)";
          e.currentTarget.style.boxShadow = "var(--shadow-sm)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = isSubCategory ? "var(--primary-200)" : "var(--border-color)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          {isSubCategory && <div style={{ color: "var(--primary-600)", fontSize: "0.875rem", fontWeight: 600, marginRight: "var(--space-1)" }}>├─</div>}
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "var(--radius-md)",
              background: category.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            {getIconComponent(category.icon)}
          </div>
          <div>
            <h4 style={{ margin: 0, fontWeight: 600 }}>
              {isSubCategory && <span style={{ fontSize: "0.75rem", color: "var(--primary-600)", fontWeight: 500, marginRight: "var(--space-1)" }}>📌</span>}
              {category.name}
            </h4>
            {isDefault && (
              <span
                style={{
                  display: "inline-block",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: "var(--primary-700)",
                  background: "var(--primary-100)",
                  padding: "var(--space-1) var(--space-2)",
                  borderRadius: "var(--radius-md)",
                  marginTop: "var(--space-1)",
                }}
              >
                Default
              </span>
            )}
          </div>
        </div>
        {!isDefault && (
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            <Button variant="ghost" size="sm" onClick={() => handleEdit(category)}>
              <Edit2 size={16} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleDelete(category.id)}>
              <Trash2 size={16} />
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
        <div>
          <h1 style={{ marginBottom: "var(--space-2)" }}>Kategori</h1>
          <p style={{ color: "var(--text-secondary)", margin: 0 }}>Kelola kategori untuk transaksi Anda</p>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-start", width: "100%" }}>
          <Button
            onClick={() => {
              setFormData({ ...formData, type: activeTab });
              setShowModal(true);
            }}
          >
            <Plus size={18} />
            Tambah Kategori
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "var(--space-2)",
          marginBottom: "var(--space-6)",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <button
          onClick={() => setActiveTab("expense")}
          style={{
            padding: "var(--space-3) var(--space-6)",
            background: "transparent",
            border: "none",
            borderBottom: activeTab === "expense" ? "3px solid var(--primary-600)" : "3px solid transparent",
            color: activeTab === "expense" ? "var(--primary-700)" : "var(--text-secondary)",
            fontWeight: 600,
            fontSize: "1rem",
            fontFamily: "inherit",
            cursor: "pointer",
            transition: "all var(--transition-fast)",
          }}
        >
          💸 Pengeluaran
        </button>
        <button
          onClick={() => setActiveTab("income")}
          style={{
            padding: "var(--space-3) var(--space-6)",
            background: "transparent",
            border: "none",
            borderBottom: activeTab === "income" ? "3px solid var(--primary-600)" : "3px solid transparent",
            color: activeTab === "income" ? "var(--primary-700)" : "var(--text-secondary)",
            fontWeight: 600,
            fontSize: "1rem",
            fontFamily: "inherit",
            cursor: "pointer",
            transition: "all var(--transition-fast)",
          }}
        >
          📈 Pemasukan
        </button>
      </div>

      {/* Default Categories */}
      {defaultCategories.length > 0 && (
        <div style={{ marginBottom: "var(--space-6)" }}>
          <h3 style={{ marginBottom: "var(--space-4)", fontWeight: 700 }}>📌 Kategori Bawaan</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {defaultCategories.map((category) => (
              <div key={category.id}>
                <CategoryCard category={category} isDefault={true} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Categories - Parent */}
      <div>
        <h3 style={{ marginBottom: "var(--space-4)", fontWeight: 700 }}>✨ Kategori Kustom Utama</h3>
        {filteredCategories.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {filteredCategories.map((category) => (
              <div key={category.id}>
                <CategoryCard category={category} isDefault={false} />
                {/* Sub-categories for this parent */}
                {subCategories.filter((sc) => sc.parentId === category.id).length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginTop: "var(--space-2)", marginLeft: "var(--space-4)" }}>
                    {subCategories
                      .filter((sc) => sc.parentId === category.id)
                      .map((subCat) => (
                        <CategoryCard key={subCat.id} category={subCat} isDefault={false} isSubCategory={true} />
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <div
              style={{
                padding: "var(--space-8)",
                textAlign: "center",
                color: "var(--text-tertiary)",
              }}
            >
              <FolderOpen size={48} style={{ margin: "0 auto var(--space-4)", opacity: 0.5 }} />
              <p>Belum ada kategori kustom. Tambahkan kategori sesuai kebutuhan Anda!</p>
            </div>
          </Card>
        )}
      </div>

      {/* Add/Edit Modal */}
      <ModernModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingCategory(null);
        }}
        title={editingCategory ? "Edit Kategori" : "Tambah Kategori"}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Batal
            </Button>
            <Button type="submit" form="category-form">
              {editingCategory ? "Simpan" : "Tambah"}
            </Button>
          </>
        }
      >
        <form id="category-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <Input label="Nama Kategori" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Hobi, Investasi, dll" required />

          <ModernSelect
            label="Tipe"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            options={[
              { value: "income", label: "Pemasukan" },
              { value: "expense", label: "Pengeluaran" },
            ]}
          />

          <ModernSelect
            label="Kategori Induk (Opsional - untuk sub-kategori)"
            value={formData.parentId}
            onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
            options={[{ value: "", label: "Tidak ada (Kategori utama)" }, ...categories.filter((c) => c.type === formData.type && !c.parentId && c.id !== editingCategory?.id).map((c) => ({ value: c.id, label: c.name }))]}
          />

          <div>
            <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "var(--space-2)", display: "block" }}>Icon</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(8, 1fr)",
                gap: "var(--space-2)",
                maxHeight: "200px",
                overflowY: "auto",
                padding: "var(--space-2)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
              }}
            >
              {availableIcons.slice(0, 40).map((iconName) => {
                const IconComponent = Icons[iconName];
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: iconName })}
                    style={{
                      padding: "var(--space-2)",
                      border: formData.icon === iconName ? "2px solid var(--primary-500)" : "1px solid var(--border-color)",
                      borderRadius: "var(--radius-md)",
                      background: formData.icon === iconName ? "var(--primary-50)" : "transparent",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all var(--transition-fast)",
                    }}
                  >
                    <IconComponent size={18} />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "var(--space-2)", display: "block" }}>Warna</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(8, 1fr)",
                gap: "var(--space-2)",
              }}
            >
              {presetColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "var(--radius-md)",
                    background: color,
                    border: formData.color === color ? "3px solid var(--text-primary)" : "1px solid var(--border-color)",
                    cursor: "pointer",
                    transition: "all var(--transition-fast)",
                  }}
                />
              ))}
            </div>
          </div>
        </form>
      </ModernModal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} onConfirm={confirmDelete} title="Hapus Kategori" message="Yakin ingin menghapus kategori ini?" confirmText="Ya, Hapus" variant="danger" />
    </div>
  );
};

export default Categories;
