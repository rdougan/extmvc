require 'ext_scaffold_core_extensions/active_record/base'
require 'ext_scaffold_core_extensions/action_controller/base'
require 'ext_scaffold_core_extensions/array'

ActiveRecord::Base.send(:include, ExtScaffoldCoreExtensions::ActiveRecord::Base)
ActionController::Base.send(:include, ExtScaffoldCoreExtensions::ActionController::Base)
Array.send(:include, ExtScaffoldCoreExtensions::Array)

#Edge seemed to break this, required necessary libs by hand above instead
# Load CoreExtensions
# Dir[File.join("#{File.dirname(__FILE__)}", 'lib', 'ext_scaffold_core_extensions', '**', '*.rb')].each do |f|
#   extension_module = f.sub(/(.*)(ext_scaffold_core_extensions.*)\.rb/,'\2').classify.constantize
#   base_module = f.sub(/(.*ext_scaffold_core_extensions.)(.*)\.rb/,'\2').classify.constantize
#   base_module.class_eval { include extension_module }
# end