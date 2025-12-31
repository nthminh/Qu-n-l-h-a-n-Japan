import React, { useState, useEffect } from 'react';
import { engineerService } from '../services/dataService';
import './EngineerList.css';

function EngineerList() {
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'engineer',
    company: '',
    position: '',
    startDate: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    loadEngineers();
  }, []);

  const loadEngineers = async () => {
    setLoading(true);
    try {
      const data = await engineerService.getAllEngineers();
      setEngineers(data);
    } catch (error) {
      alert('Lỗi khi tải danh sách: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await engineerService.updateEngineer(editingId, formData);
        alert('Cập nhật thành công!');
      } else {
        await engineerService.addEngineer(formData);
        alert('Thêm mới thành công!');
      }
      resetForm();
      loadEngineers();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (engineer) => {
    setFormData({
      name: engineer.name,
      type: engineer.type,
      company: engineer.company,
      position: engineer.position,
      startDate: engineer.startDate,
      email: engineer.email || '',
      phone: engineer.phone || ''
    });
    setEditingId(engineer.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      setLoading(true);
      try {
        await engineerService.deleteEngineer(id);
        alert('Xóa thành công!');
        loadEngineers();
      } catch (error) {
        alert('Lỗi khi xóa: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'engineer',
      company: '',
      position: '',
      startDate: '',
      email: '',
      phone: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="engineer-list-container">
      <div className="header">
        <h2>Danh sách Kỹ sư & Tu nghiệp sinh</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Đóng' : 'Thêm mới'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h3>{editingId ? 'Cập nhật' : 'Thêm mới'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Họ và tên *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Loại *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  <option value="engineer">Kỹ sư</option>
                  <option value="intern">Tu nghiệp sinh</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Công ty *</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Vị trí *</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Ngày bắt đầu *</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
              <th>Họ và tên</th>
              <th>Loại</th>
              <th>Công ty</th>
              <th>Vị trí</th>
              <th>Ngày bắt đầu</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {engineers.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>
                  Chưa có dữ liệu
                </td>
              </tr>
            ) : (
              engineers.map((engineer) => (
                <tr key={engineer.id}>
                  <td>{engineer.name}</td>
                  <td>
                    <span className={`badge ${engineer.type}`}>
                      {engineer.type === 'engineer' ? 'Kỹ sư' : 'Tu nghiệp sinh'}
                    </span>
                  </td>
                  <td>{engineer.company}</td>
                  <td>{engineer.position}</td>
                  <td>{engineer.startDate}</td>
                  <td>{engineer.email || '-'}</td>
                  <td>{engineer.phone || '-'}</td>
                  <td>
                    <button onClick={() => handleEdit(engineer)} className="btn-edit">
                      Sửa
                    </button>
                    <button onClick={() => handleDelete(engineer.id)} className="btn-delete">
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

export default EngineerList;
