require 'rails_helper'

RSpec.describe Api::V3::Profile, type: :model do
  include_context 'api v3 brazil context node types'

  describe :validate do
    let(:profile_without_context_node_type) {
      FactoryBot.build(
        :api_v3_profile, context_node_type: nil
      )
    }
    let(:duplicate) {
      FactoryBot.create(
        :api_v3_profile,
        context_node_type: api_v3_exporter1_context_node,
        name: 'actor'
      )

      FactoryBot.build(
        :api_v3_profile,
        context_node_type: api_v3_exporter1_context_node,
        name: 'actor'
      )
    }
    it 'fails when context node type missing' do
      expect(profile_without_context_node_type).to have(2).
        errors_on(:context_node_type)
    end
    it 'fails when context node type taken' do
      expect(duplicate).to have(1).errors_on(:name)
    end
  end
end
