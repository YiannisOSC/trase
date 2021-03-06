ActiveAdmin.register Api::V3::ContextNodeTypeProperty, as: 'ContextNodeTypeProperty' do
  menu parent: 'General Settings', priority: 3

  permit_params :context_node_type_id, :column_group, :is_default,
                :is_geo_column, :is_choropleth_disabled

  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      clear_cache_for_regexp('/api/v3/contexts')
    end
  end

  form do |f|
    f.semantic_errors
    inputs do
      input :context_node_type, as: :select, required: true,
                                collection: Api::V3::ContextNodeType.select_options
      input :column_group, as: :select, required: true,
                           collection: Api::V3::ContextNodeTypeProperty::COLUMN_GROUP,
                           hint: object.class.column_comment('column_group')
      input :is_default, as: :boolean, required: true,
                         hint: object.class.column_comment('is_default')
      input :is_geo_column, as: :boolean, required: true,
                            hint: object.class.column_comment('is_geo_column')
      input :is_choropleth_disabled, as: :boolean, required: true,
                                     hint: object.class.column_comment('is_choropleth_disabled')
    end
    f.actions
  end

  index do
    column('Country', sortable: true) { |property| property.context_node_type&.context&.country&.name }
    column('Commodity', sortable: true) { |property| property.context_node_type&.context&.commodity&.name }
    column('Node Type', sortable: true) { |property| property.context_node_type&.node_type&.name }
    column :column_group
    column :is_default
    column :is_geo_column
    column :is_choropleth_disabled
    actions
  end

  show do
    attributes_table do
      row('Country') { |property| property.context_node_type&.context&.country&.name }
      row('Commodity') { |property| property.context_node_type&.context&.commodity&.name }
      row('Node Type') { |property| property.context_node_type&.node_type&.name }

      row :column_group
      row :is_default
      row :is_geo_column
      row :is_choropleth_disabled
      row :created_at
      row :updated_at
    end
  end

  filter :context_node_type, collection: -> {
    Api::V3::ContextNodeType.
      select_options
  }

  filter :context_node_type_context_id, label: 'Context', as: :select, collection: -> {
    Api::V3::Context.
      select_options
  }
end
