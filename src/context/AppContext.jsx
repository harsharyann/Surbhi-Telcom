import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import toast from 'react-hot-toast';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [records, setRecords] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Auth State Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Re-fetch data whenever auth state changes (login/logout)
      // This ensures RLS-protected data is fetched after login
      fetchInitialData();
    });

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session) fetchInitialData();
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
        dateOfOpening: r.date_of_opening,
        customerName: r.customer_name,
        fatherName: r.father_name,
        customerId: r.customer_id,
        aadharNumber: r.aadhar_number,
        accountNumber: r.account_number,
        mobileNumber: r.mobile_number,
        address: r.address,
        nomineeName: r.nominee_name,
        nomineeAge: r.nominee_age,
        schemeApy: r.scheme_apy,
        schemePmsby: r.scheme_pmsby,
        schemePmjjby: r.scheme_pmjjby,
        photo: r.photo_url ? { dataUrl: r.photo_url } : null,
        signature: r.signature_url ? { dataUrl: r.signature_url } : null,
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

  // Helper: Upload Base64 to Storage
  const uploadBase64 = async (base64, bucket, path) => {
    try {
      const res = await fetch(base64);
      const blob = await res.blob();
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, blob, { upsert: true });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);
      return publicUrl;
    } catch (err) {
      console.error(`Upload error (${bucket}):`, err.message);
      return null;
    }
  };

  const addRecord = async (record) => {
    try {
      let photo_url = null;
      let signature_url = null;

      if (record.photo) {
        photo_url = await uploadBase64(record.photo.dataUrl, 'photos', `${crypto.randomUUID()}-${record.photo.name}`);
      }
      if (record.signature) {
        signature_url = await uploadBase64(record.signature.dataUrl, 'signatures', `${crypto.randomUUID()}-${record.signature.name}`);
      }

      const dbRecord = {
        sl_no: record.slNo,
        date_of_opening: record.dateOfOpening,
        customer_name: record.customerName,
        father_name: record.fatherName,
        customer_id: record.customerId,
        aadhar_number: record.aadharNumber,
        account_number: record.accountNumber,
        mobile_number: record.mobileNumber,
        address: record.address,
        nominee_name: record.nomineeName,
        nominee_age: record.nomineeAge,
        scheme_apy: record.schemeApy,
        scheme_pmsby: record.schemePmsby,
        scheme_pmjjby: record.schemePmjjby,
        photo_url,
        signature_url,
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
        dateOfOpening: data.date_of_opening,
        customerName: data.customer_name,
        fatherName: data.father_name,
        customerId: data.customer_id,
        aadharNumber: data.aadhar_number,
        accountNumber: data.account_number,
        mobileNumber: data.mobile_number,
        address: data.address,
        nomineeName: data.nominee_name,
        nomineeAge: data.nominee_age,
        schemeApy: data.scheme_apy,
        schemePmsby: data.scheme_pmsby,
        schemePmjjby: data.scheme_pmjjby,
        photo: data.photo_url ? { dataUrl: data.photo_url } : null,
        signature: data.signature_url ? { dataUrl: data.signature_url } : null,
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
      // Bulk insert for Excel (assume no photos in Excel for now as per current logic)
      const dbRecords = recordsArray.map(r => ({
        sl_no: r.slNo,
        date_of_opening: r.dateOfOpening,
        customer_name: r.customerName,
        father_name: r.fatherName,
        customer_id: r.customerId,
        aadhar_number: r.aadharNumber,
        account_number: r.accountNumber,
        mobile_number: r.mobileNumber,
        address: r.address,
        nominee_name: r.nomineeName,
        nominee_age: r.nomineeAge,
        scheme_apy: r.schemeApy,
        scheme_pmsby: r.schemePmsby,
        scheme_pmjjby: r.schemePmjjby,
      }));

      const { data, error } = await supabase
        .from('records')
        .insert(dbRecords)
        .select();
      
      if (error) throw error;

      const mappedRecords = data.map(r => ({
        id: r.id,
        slNo: r.sl_no,
        dateOfOpening: r.date_of_opening,
        customerName: r.customer_name,
        fatherName: r.father_name,
        customerId: r.customer_id,
        aadharNumber: r.aadhar_number,
        accountNumber: r.account_number,
        mobileNumber: r.mobile_number,
        address: r.address,
        nomineeName: r.nominee_name,
        nomineeAge: r.nominee_age,
        schemeApy: r.scheme_apy,
        schemePmsby: r.scheme_pmsby,
        schemePmjjby: r.scheme_pmjjby,
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
        date_of_opening: updatedData.dateOfOpening,
        customer_name: updatedData.customerName,
        father_name: updatedData.fatherName,
        customer_id: updatedData.customerId,
        aadhar_number: updatedData.aadharNumber,
        account_number: updatedData.accountNumber,
        mobile_number: updatedData.mobileNumber,
        address: updatedData.address,
        nominee_name: updatedData.nomineeName,
        nominee_age: updatedData.nomineeAge,
        scheme_apy: updatedData.schemeApy,
        scheme_pmsby: updatedData.schemePmsby,
        scheme_pmjjby: updatedData.schemePmjjby,
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
        dateOfOpening: data.date_of_opening,
        customerName: data.customer_name,
        fatherName: data.father_name,
        customerId: data.customer_id,
        aadharNumber: data.aadhar_number,
        accountNumber: data.account_number,
        mobileNumber: data.mobile_number,
        address: data.address,
        nomineeName: data.nominee_name,
        nomineeAge: data.nominee_age,
        schemeApy: data.scheme_apy,
        schemePmsby: data.scheme_pmsby,
        schemePmjjby: data.scheme_pmjjby,
        photo: data.photo_url ? { dataUrl: data.photo_url } : null,
        signature: data.signature_url ? { dataUrl: data.signature_url } : null,
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
    } catch (err) {
      toast.error('Delete failed: ' + err.message);
    }
  };

  const clearAllRecords = async () => {
    try {
      const { error } = await supabase.from('records').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) throw error;
      setRecords([]);
      toast.success('All records cleared');
    } catch (err) {
      toast.error('Clear failed: ' + err.message);
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

      setUploads(prev => [data, ...prev]);
      return data;
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
      isAdminLoggedIn: !!user, adminLogin, adminLogout, loading,
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
