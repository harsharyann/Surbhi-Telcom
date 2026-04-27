import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import toast from 'react-hot-toast';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [records, setRecords] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 1. Auth State Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      fetchInitialData();
    });

    // Initial session and connection check
    const checkConnection = async () => {
      try {
        const { error } = await supabase.from('records').select('count', { count: 'exact', head: true });
        setIsConnected(!error || error.code !== 'PGRST301');
      } catch {
        setIsConnected(false);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session) fetchInitialData();
      checkConnection();
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchInitialData = async () => {
    try {
      const { data: recData, error: recError } = await supabase
        .from('records')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (recError) throw recError;
      
      // Map snake_case from DB to camelCase for frontend
      const mappedRecords = recData.map(r => ({
        id: r.id,
        slNo: r.sl_no,
        customerName: r.customer_name,
        aadharNumber: r.aadhar_number,
        accountNumber: r.account_number,
        mobileNumber: r.mobile_number,
        createdAt: r.created_at
      }));
      setRecords(mappedRecords);

      const { data: upData, error: upError } = await supabase
        .from('documents')
        .select('*')
        .order('uploaded_at', { ascending: false });
      
      if (upError) throw upError;
      
      const mappedUploads = upData.map(u => ({
        id: u.id,
        name: u.name,
        size: u.size,
        type: u.type,
        url: u.url,
        uploadedAt: u.uploaded_at
      }));
      setUploads(mappedUploads);
    } catch (err) {
      console.error('Error fetching data:', err.message);
    }
  };

  const adminLogin = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      toast.error(error.message);
      return false;
    }
    return true;
  };

  const adminLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out');
  };

  const addRecord = async (record) => {
    try {
      const dbRecord = {
        sl_no: record.slNo,
        customer_name: record.customerName,
        aadhar_number: record.aadharNumber,
        account_number: record.accountNumber,
        mobile_number: record.mobileNumber,
      };

      const { data, error } = await supabase
        .from('records')
        .insert([dbRecord])
        .select()
        .single();
      
      if (error) throw error;
      
      const mappedRecord = {
        id: data.id,
        slNo: data.sl_no,
        customerName: data.customer_name,
        aadharNumber: data.aadhar_number,
        accountNumber: data.account_number,
        mobileNumber: data.mobile_number,
        createdAt: data.created_at
      };

      setRecords(prev => [mappedRecord, ...prev]);
      return mappedRecord;
    } catch (err) {
      toast.error('Failed to save record: ' + err.message);
      return null;
    }
  };

  const addRecords = async (recordsArray) => {
    try {
      const dbRecords = recordsArray.map(r => ({
        sl_no: r.slNo,
        customer_name: r.customerName,
        aadhar_number: r.aadharNumber,
        account_number: r.accountNumber,
        mobile_number: r.mobileNumber,
      }));

      const { data, error } = await supabase
        .from('records')
        .insert(dbRecords)
        .select();
      
      if (error) throw error;

      const mappedRecords = data.map(r => ({
        id: r.id,
        slNo: r.sl_no,
        customerName: r.customer_name,
        aadharNumber: r.aadhar_number,
        accountNumber: r.account_number,
        mobileNumber: r.mobile_number,
        createdAt: r.created_at
      }));

      setRecords(prev => [...mappedRecords, ...prev]);
      return mappedRecords;
    } catch (err) {
      toast.error('Failed to import records: ' + err.message);
    }
  };

  const updateRecord = async (id, updatedData) => {
    try {
      const dbData = {
        sl_no: updatedData.slNo,
        customer_name: updatedData.customerName,
        aadhar_number: updatedData.aadharNumber,
        account_number: updatedData.accountNumber,
        mobile_number: updatedData.mobileNumber,
      };

      const { data, error } = await supabase
        .from('records')
        .update(dbData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      const mappedRecord = {
        id: data.id,
        slNo: data.sl_no,
        customerName: data.customer_name,
        aadharNumber: data.aadhar_number,
        accountNumber: data.account_number,
        mobileNumber: data.mobile_number,
        createdAt: data.created_at
      };

      setRecords(prev => prev.map(r => r.id === id ? mappedRecord : r));
      toast.success('Record updated');
      return true;
    } catch (err) {
      toast.error('Update failed: ' + err.message);
      return false;
    }
  };

  const deleteRecord = async (id) => {
    try {
      const { error } = await supabase.from('records').delete().eq('id', id);
      if (error) throw error;
      setRecords(prev => prev.filter(r => r.id !== id));
      toast.success('Record deleted');
      return true;
    } catch (err) {
      toast.error('Delete failed: ' + err.message);
      return false;
    }
  };

  const clearAllRecords = async () => {
    try {
      const { error } = await supabase.from('records').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) throw error;
      setRecords([]);
      toast.success('All records cleared');
      return true;
    } catch (err) {
      toast.error('Clear failed: ' + err.message);
      return false;
    }
  };

  const addUpload = async (file) => {
    try {
      // 1. Upload to Storage
      const path = `${crypto.randomUUID()}-${file.name}`;
      const { error: upError } = await supabase.storage.from('documents').upload(path, file);
      if (upError) throw upError;

      const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(path);

      // 2. Save to DB
      const dbFile = {
        name: file.name,
        size: file.size,
        type: file.type,
        url: publicUrl,
      };

      const { data, error } = await supabase.from('documents').insert([dbFile]).select().single();
      if (error) throw error;

      const mappedUpload = {
        id: data.id,
        name: data.name,
        size: data.size,
        type: data.type,
        url: data.url,
        uploadedAt: data.uploaded_at
      };

      setUploads(prev => [mappedUpload, ...prev]);
      return mappedUpload;
    } catch (err) {
      toast.error('Upload failed: ' + err.message);
    }
  };

  const deleteUpload = async (id) => {
    try {
      const { error } = await supabase.from('documents').delete().eq('id', id);
      if (error) throw error;
      setUploads(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      toast.error('Delete failed: ' + err.message);
    }
  };

  return (
    <AppContext.Provider value={{
      records, addRecord, addRecords, updateRecord, deleteRecord, clearAllRecords,
      uploads, addUpload, deleteUpload,
      isAdminLoggedIn: !!user, adminLogin, adminLogout, loading, isConnected,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
