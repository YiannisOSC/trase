require 'rails_helper'

RSpec.describe 'Place profile', type: :request do
  include_context 'api v3 brazil municipality ind values'
  include_context 'api v3 brazil municipality qual values'
  include_context 'api v3 brazil municipality quant values'
  include_context 'api v3 brazil flows quants'

  describe 'GET /api/v3/contexts/:context_id/nodes/:id/place' do
    it 'validates node types' do
      expect { get "/api/v3/contexts/#{api_v3_context.id}/nodes/#{api_v3_country_of_destination1_node.id}/place" }.to raise_error(ActiveRecord::RecordNotFound)
      expect { get "/api/v3/contexts/#{api_v3_context.id}/nodes/#{api_v3_exporter1_node.id}/place" }.to raise_error(ActiveRecord::RecordNotFound)
      expect { get "/api/v3/contexts/#{api_v3_context.id}/nodes/#{api_v3_importer1_node.id}/place" }.to raise_error(ActiveRecord::RecordNotFound)
      expect { get "/api/v3/contexts/#{api_v3_context.id}/nodes/#{api_v3_port1_node.id}/place" }.to raise_error(ActiveRecord::RecordNotFound)

      expect { get "/api/v3/contexts/#{api_v3_context.id}/nodes/#{api_v3_municipality_node.id}/place" }.to_not raise_error
      expect { get "/api/v3/contexts/#{api_v3_context.id}/nodes/#{api_v3_logistics_hub_node.id}/place" }.to_not raise_error
      expect { get "/api/v3/contexts/#{api_v3_context.id}/nodes/#{api_v3_biome_node.id}/place" }.to_not raise_error
      expect { get "/api/v3/contexts/#{api_v3_context.id}/nodes/#{api_v3_state_node.id}/place" }.to_not raise_error
    end

    it 'has the correct response structure' do
      get "/api/v3/contexts/#{api_v3_context.id}/nodes/#{api_v3_municipality_node.id}/place"

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema('v3_place_profile')
    end
  end
end
