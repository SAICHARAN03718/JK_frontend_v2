import { supabase } from './supabaseClient';

// Client Registration Functions
export const clientRegistrationService = {
  
  // Create a new client
  async createClient(clientData) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([{
          client_name: clientData.clientName,
          address: clientData.address,
          gstin: clientData.gstin || null
        }])
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error creating client:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete a client (cascades to branches, templates, LRs, etc. per DB FKs)
  async deleteClient(clientId) {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('client_id', clientId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting client:', error);
      return { success: false, error: error.message };
    }
  },

  // Create a client branch
  async createBranch(branchData) {
    try {
      const { data, error } = await supabase
        .from('client_branches')
        .insert([{
          client_id: branchData.clientId,
          branch_name: branchData.branchName,
          branch_address: branchData.branchAddress,
          branch_gstin: branchData.branchGstin || null
        }])
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error creating branch:', error);
      return { success: false, error: error.message };
    }
  },

  // Update a client branch
  async updateBranch(branchId, branchData) {
    try {
      const { data, error } = await supabase
        .from('client_branches')
        .update({
          branch_name: branchData.branchName,
          branch_address: branchData.branchAddress,
          branch_gstin: branchData.branchGstin || null
        })
        .eq('branch_id', branchId)
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error updating branch:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete a client branch
  async deleteBranch(branchId) {
    try {
      const { error } = await supabase
        .from('client_branches')
        .delete()
        .eq('branch_id', branchId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting branch:', error);
      return { success: false, error: error.message };
    }
  },

  // Create template fields for a client/branch
  async createTemplateFields(fieldsData) {
    try {
      const fields = fieldsData.map((field, index) => ({
        client_id: field.clientId,
        branch_id: field.branchId || null,
        field_name: field.fieldName,
        field_key: field.fieldKey || field.fieldName.toLowerCase().replace(/\s+/g, '_'),
        display_order: index,
        pod_requirement: field.podRequirement || 'NOT_APPLICABLE'
      }));

      const { data, error } = await supabase
        .from('client_field_templates')
        .insert(fields)
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating template fields:', error);
      return { success: false, error: error.message };
    }
  },

  // Complete client registration (simplified version)
  async registerClient(registrationData) {
    try {
      // Step 1: Create client
      const clientResult = await this.createClient(registrationData.client);
      if (!clientResult.success) {
        throw new Error(clientResult.error);
      }

      const clientId = clientResult.data.client_id;
      const createdBranches = [];

      // Step 2: Create branches if provided
      if (registrationData.branches && registrationData.branches.length > 0) {
        for (const branchData of registrationData.branches) {
          const branchResult = await this.createBranch({
            ...branchData,
            clientId
          });
          if (!branchResult.success) {
            throw new Error(branchResult.error);
          }
          createdBranches.push(branchResult.data);
        }
      }

      // Step 3: Create template fields if provided
      if (registrationData.templateFields && registrationData.templateFields.length > 0) {
        const fieldsWithIds = registrationData.templateFields.map(field => ({
          ...field,
          clientId,
          branchId: null // For now, all fields are base fields
        }));

        const fieldsResult = await this.createTemplateFields(fieldsWithIds);
        if (!fieldsResult.success) {
          throw new Error(fieldsResult.error);
        }
      }

      return {
        success: true,
        data: {
          client: clientResult.data,
          branches: createdBranches,
          message: `Client registered successfully with ${createdBranches.length} branch(es)`
        }
      };

    } catch (error) {
      console.error('Error in complete client registration:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all clients
  async getAllClients() {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          client_branches (
            branch_id,
            branch_name,
            branch_address,
            branch_gstin
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching clients:', error);
      return { success: false, error: error.message };
    }
  },

  // Get client template fields
  async getClientTemplateFields(clientId, branchId = null) {
    try {
      let query = supabase
        .from('client_field_templates')
        .select('*')
        .eq('client_id', clientId);

      if (branchId) {
        query = query.or(`branch_id.is.null,branch_id.eq.${branchId}`);
      } else {
        query = query.is('branch_id', null);
      }

      const { data, error } = await query.order('display_order');

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching template fields:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete a template field by field_id
  async deleteTemplateField(fieldId) {
    try {
      const { error } = await supabase
        .from('client_field_templates')
        .delete()
        .eq('field_id', fieldId);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting template field:', error);
      return { success: false, error: error.message };
    }
  }
};

export default clientRegistrationService;
