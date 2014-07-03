class Image < ActiveRecord::Base
  belongs_to :test

  validates_presence_of :url
end
