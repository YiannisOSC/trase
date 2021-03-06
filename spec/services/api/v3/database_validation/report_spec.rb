RSpec.describe Api::V3::DatabaseValidation::Report do
  before do
    Api::V3::DownloadAttribute.skip_callback(:commit, :after, :refresh_dependencies)
    Api::V3::MapAttributeGroup.skip_callback(:commit, :after, :refresh_dependencies)
    Api::V3::MapAttribute.skip_callback(:commit, :after, :refresh_dependencies)
    Api::V3::RecolorByAttribute.skip_callback(:commit, :after, :refresh_dependencies)
    Api::V3::ResizeByAttribute.skip_callback(:commit, :after, :refresh_dependencies)
  end
  after do
    Api::V3::DownloadAttribute.set_callback(:commit, :after, :refresh_dependencies)
    Api::V3::MapAttributeGroup.set_callback(:commit, :after, :refresh_dependencies)
    Api::V3::MapAttribute.set_callback(:commit, :after, :refresh_dependencies)
    Api::V3::RecolorByAttribute.set_callback(:commit, :after, :refresh_dependencies)
    Api::V3::ResizeByAttribute.set_callback(:commit, :after, :refresh_dependencies)
  end

  let(:report) {
    Api::V3::DatabaseValidation::Report.new
  }

  context 'when configuration complete' do
    include_context 'minimum complete configuration'

    describe :call do
      it 'finds no errors' do
        expect(report.call).to be_empty
      end
    end
  end

  context 'when configuration incomplete or incorrect' do
    let!(:context) { FactoryBot.create(:api_v3_context) }
    let!(:context_property) {
      tmp = FactoryBot.create(:api_v3_context_property, context: context)
      tmp.update_attribute(:default_basemap, :zonk) # skip validations
      tmp
    }
    let!(:qual) { FactoryBot.create(:api_v3_qual) }
    let!(:quant) { FactoryBot.create(:api_v3_quant) }
    let!(:ind) { FactoryBot.create(:api_v3_ind) }
    describe :call do
      it 'finds errors' do
        expect(report.call).not_to be_empty
      end
    end
  end
end
