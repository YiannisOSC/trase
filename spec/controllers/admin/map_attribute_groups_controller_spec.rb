require 'rails_helper'

RSpec.describe Admin::MapAttributeGroupsController, type: :controller do
  let(:user) { FactoryBot.create(:user) }
  before { sign_in user }
  before do
    Api::V3::MapAttributeGroup.skip_callback(:commit, :after, :refresh_dependencies)
  end
  after do
    Api::V3::MapAttributeGroup.set_callback(:commit, :after, :refresh_dependencies)
  end
  describe 'POST create' do
    let(:context) { FactoryBot.create(:api_v3_context) }
    let(:valid_attributes) {
      FactoryBot.attributes_for(
        :api_v3_map_attribute_group, context_id: context.id
      )
    }
    it 'clears cache' do
      expect(controller).to receive(:clear_cache_for_regexp)
      post :create, params: {api_v3_map_attribute_group: valid_attributes}
    end
  end
end
