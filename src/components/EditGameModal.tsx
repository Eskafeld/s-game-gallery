
import React, { useState, useRef } from 'react';
import { X, Upload, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Game } from '@/pages/Index';

interface EditGameModalProps {
  game: Game;
  onEdit: (game: Omit<Game, 'id'>) => void;
  onClose: () => void;
}

export const EditGameModal: React.FC<EditGameModalProps> = ({ game, onEdit, onClose }) => {
  const [formData, setFormData] = useState({
    title: game.title,
    genre: game.genre,
    description: game.description,
    steamUrl: game.steamUrl || '',
    thumbnail: game.thumbnail
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, thumbnail: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.genre && formData.description) {
      onEdit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-purple-800/90 backdrop-blur-md border border-purple-600/30 rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Edit Game</h2>
          <Button onClick={onClose} variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              name="title"
              placeholder="Game Name"
              value={formData.title}
              onChange={handleInputChange}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              required
            />
          </div>

          <div>
            <Input
              name="steamUrl"
              placeholder="Steam URL"
              value={formData.steamUrl}
              onChange={handleInputChange}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>

          <div>
            <Input
              name="genre"
              placeholder="Genre (e.g. Action, Strategy)"
              value={formData.genre}
              onChange={handleInputChange}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              required
            />
          </div>

          <div>
            <Textarea
              name="description"
              placeholder="Game Synopsis"
              value={formData.description}
              onChange={handleInputChange}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[100px]"
              required
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">Game Image</label>
            <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center">
              {formData.thumbnail ? (
                <div className="space-y-4">
                  <img 
                    src={formData.thumbnail} 
                    alt="Preview" 
                    className="w-full h-32 object-cover rounded-lg mx-auto"
                  />
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    Change Image
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Image className="w-12 h-12 text-white/50 mx-auto" />
                  <div>
                    <p className="text-white/70 mb-2">Drag & drop an image here, or</p>
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      browse files
                    </Button>
                  </div>
                  <p className="text-white/50 text-sm">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Changes
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 border-white/30 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
