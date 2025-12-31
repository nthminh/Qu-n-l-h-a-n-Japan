import React, { useState, useEffect } from 'react';
import { invoiceService } from '../services/dataService';
import './InvoiceList.css';

function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    company: '',
    issueDate: '',
    dueDate: '',
    amount: '',
    status: 'pending',
    description: ''
  });

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const data = await invoiceService.getAllInvoices();
      setInvoices(data);
    } catch (error) {
      alert('Lỗi khi tải danh sách hóa đơn: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await invoiceService.updateInvoice(editingId, formData);
        alert('Cập nhật hóa đơn thành công!');
      } else {
        await invoiceService.addInvoice(formData);
        alert('Thêm hóa đơn thành công!');
      }
      resetForm();
      loadInvoices();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (invoice) => {
    setFormData({
      invoiceNumber: invoice.invoiceNumber,
      company: invoice.company,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      amount: invoice.amount,
      status: invoice.status,
      description: invoice.description || ''
    });
    setEditingId(invoice.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hóa đơn này?')) {
      setLoading(true);
      try {
        await invoiceService.deleteInvoice(id);
        alert('Xóa hóa đơn thành công!');
        loadInvoices();
      } catch (error) {
        alert('Lỗi khi xóa: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      invoiceNumber: '',
      company: '',
      issueDate: '',
      dueDate: '',
      amount: '',
      status: 'pending',
      description: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { text: 'Chờ thanh toán', class: 'status-pending' },
      paid: { text: 'Đã thanh toán', class: 'status-paid' },
      overdue: { text: 'Quá hạn', class: 'status-overdue' }
    };
    const statusInfo = statusMap[status] || statusMap.pending;
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  return (
    <div className="invoice-list-container">
      <div className="header">
        <h2>Quản lý Hóa đơn</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Đóng' : 'Thêm hóa đơn'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h3>{editingId ? 'Cập nhật hóa đơn' : 'Thêm hóa đơn mới'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Số hóa đơn *</label>
                <input
                  type="text"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  required
                  placeholder="VD: INV-2025-001"
                />
              </div>
              <div className="form-group">
                <label>Công ty *</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                  placeholder="Tên công ty"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Ngày xuất hóa đơn *</label>
                <input
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Ngày đến hạn *</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Số tiền (VND) *</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  min="0"
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label>Trạng thái *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  required
                >
                  <option value="pending">Chờ thanh toán</option>
                  <option value="paid">Đã thanh toán</option>
                  <option value="overdue">Quá hạn</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Ghi chú</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                placeholder="Ghi chú thêm về hóa đơn..."
              />
            </div>
            <div className="form-actions">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Đang xử lý...' : (editingId ? 'Cập nhật' : 'Thêm mới')}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && <div className="loading">Đang tải...</div>}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Số hóa đơn</th>
              <th>Công ty</th>
              <th>Ngày xuất</th>
              <th>Ngày đến hạn</th>
              <th>Số tiền</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>
                  Chưa có hóa đơn nào
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td><strong>{invoice.invoiceNumber}</strong></td>
                  <td>{invoice.company}</td>
                  <td>{invoice.issueDate}</td>
                  <td>{invoice.dueDate}</td>
                  <td>{formatCurrency(invoice.amount)}</td>
                  <td>{getStatusBadge(invoice.status)}</td>
                  <td>
                    <button onClick={() => handleEdit(invoice)} className="btn-edit">
                      Sửa
                    </button>
                    <button onClick={() => handleDelete(invoice.id)} className="btn-delete">
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InvoiceList;
