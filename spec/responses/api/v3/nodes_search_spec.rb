require 'rails_helper'

RSpec.describe 'Search', type: :request do
  include_context 'api v3 brazil flows'

  describe 'GET /api/v3/nodes/search' do
    before(:each) do
      Api::V3::Readonly::Node.refresh
    end

    it 'has the correct response structure' do
      get "/api/v3/nodes/search?query=mato"

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema('v3_nodes_search')
    end
  end
end
