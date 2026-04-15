import { useState, useRef } from 'react';
import { Upload, File, Trash2, FileImage, FileText, Download, FolderOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function FileIcon({ type }) {
  if (type?.startsWith('image/')) return <FileImage size={20} color="#0052CC" />;
  return <FileText size={20} color="#6366f1" />;
}

export default function FileSection() {
  const { uploads, addUpload, deleteUpload } = useApp();
  const inputRef = useRef();
  const [drag, setDrag] = useState(false);

  const handleFiles = (files) => {
    const arr = Array.from(files);
    arr.forEach(file => {
      addUpload(file);
    });
    if (arr.length > 0) toast.success(`${arr.length} file(s) uploaded successfully!`);
  };

  return (
    <div className="glass-card animate-fadeInUp delay-200" style={{ padding: '28px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ 
          background: 'linear-gradient(135deg,#003A8F,#0052CC)', 
          borderRadius: '10px', padding: '8px', display: 'flex'
        }}>
          <FolderOpen size={18} color="#fff" />
        </div>
        <div>
          <h3 style={{ fontWeight: 700, color: '#003A8F', fontSize: '1.05rem' }}>Document Uploads</h3>
          <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{uploads.length} file(s) stored</p>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        className={`upload-zone ${drag ? 'drag-over' : ''}`}
        style={{ padding: '32px', textAlign: 'center', marginBottom: '20px', cursor: 'pointer' }}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          style={{ display: 'none' }}
          onChange={e => handleFiles(e.target.files)}
        />
        <div style={{ 
          width: '56px', height: '56px',
          background: 'linear-gradient(135deg, #e0eaff, #c7d9ff)',
          borderRadius: '16px', margin: '0 auto 14px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.3s',
          transform: drag ? 'scale(1.1)' : 'scale(1)',
        }}>
          <Upload size={26} color="#003A8F" />
        </div>
        <div style={{ fontWeight: 600, color: '#334155', fontSize: '0.92rem' }}>
          {drag ? 'Release to upload' : 'Drop files here or'}&nbsp;
          {!drag && <span style={{ color: '#0052CC' }}>browse</span>}
        </div>
        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '6px' }}>
          PDF, images, and documents accepted
        </div>
      </div>

      {/* File List */}
      {uploads.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '32px',
          background: '#f8faff', borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}>
          <File size={36} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
          <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No documents uploaded yet</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {uploads.map((file, i) => (
            <div
              key={file.id}
              className={`animate-fadeInUp delay-${Math.min(i * 100 + 100, 400)}`}
              style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '14px 16px',
                background: '#f8faff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#eef3ff'; e.currentTarget.style.borderColor = '#b3c8f0'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f8faff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
            >
              <div style={{
                width: '40px', height: '40px',
                background: 'linear-gradient(135deg, #e0eaff, #c7d9ff)',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <FileIcon type={file.type} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {file.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                  {formatBytes(file.size)} · {new Date(file.uploadedAt).toLocaleDateString('en-IN')}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => { deleteUpload(file.id); toast.success('File removed'); }}
                  style={{
                    width: '32px', height: '32px',
                    background: '#fee2e2', border: 'none', borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fca5a5'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fee2e2'}
                  title="Delete"
                >
                  <Trash2 size={14} color="#991b1b" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
