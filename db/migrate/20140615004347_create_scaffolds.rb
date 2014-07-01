class CreateScaffolds < ActiveRecord::Migration
  def change
    create_table :tests do |t|
      t.string :name
      t.string :imgur_url    
  
      t.timestamps
    end
  end
end
