import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import toast from 'react-hot-toast';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [records, setRecords] = useState([]);
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
        customerId: r.customer_id,
        slNo: r.sl_no,
        customerName: r.customer_name,
        aadharNumber: r.aadhar_number,
        accountNumber: r.account_number,
        mobileNumber: r.mobile_number,
        createdAt: r.created_at
      })).sort((a, b) => (parseInt(a.slNo) || 0) - (parseInt(b.slNo) || 0));
      setRecords(mappedRecords);
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

  const adminGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/admin',
      }
    });
    if (error) {
      toast.error('Google Sign-In Error: ' + error.message);
      return false;
    }
  };

  const adminLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out');
  };

  const addRecord = async (record) => {
    try {
      const dbRecord = {
        customer_id: `ST-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100)}`,
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
        customerId: data.customer_id,
        slNo: data.sl_no,
        customerName: data.customer_name,
        aadharNumber: data.aadhar_number,
        accountNumber: data.account_number,
        mobileNumber: data.mobile_number,
        createdAt: data.created_at
      };

      setRecords(prev => {
        const newRecords = [mappedRecord, ...prev];
        return newRecords.sort((a, b) => (parseInt(a.slNo) || 0) - (parseInt(b.slNo) || 0));
      });
      return mappedRecord;
    } catch (err) {
      toast.error('Failed to save record: ' + err.message);
      return null;
    }
  };

  const addRecords = async (recordsArray) => {
    try {
      const dbRecords = recordsArray.map(r => ({
        customer_id: r.customerId || `ST-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`,
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
        customerId: r.customer_id,
        slNo: r.sl_no,
        customerName: r.customer_name,
        aadharNumber: r.aadhar_number,
        accountNumber: r.account_number,
        mobileNumber: r.mobile_number,
        createdAt: r.created_at
      }));

      setRecords(prev => {
        const newRecords = [...mappedRecords, ...prev];
        return newRecords.sort((a, b) => (parseInt(a.slNo) || 0) - (parseInt(b.slNo) || 0));
      });
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
        customerId: data.customer_id,
        slNo: data.sl_no,
        customerName: data.customer_name,
        aadharNumber: data.aadhar_number,
        accountNumber: data.account_number,
        mobileNumber: data.mobile_number,
        createdAt: data.created_at
      };

      setRecords(prev => {
        const newRecords = prev.map(r => r.id === id ? mappedRecord : r);
        return newRecords.sort((a, b) => (parseInt(a.slNo) || 0) - (parseInt(b.slNo) || 0));
      });
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

  return (
    <AppContext.Provider value={{
      records, addRecord, addRecords, updateRecord, deleteRecord, clearAllRecords,
      isAdminLoggedIn: !!user, adminLogin, adminGoogleLogin, adminLogout, loading, isConnected,
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
