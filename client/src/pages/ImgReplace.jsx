import { useState } from 'react';
// Make sure all used icons are imported, including Loader2
import { Upload, Shirt, WaypointsIcon as PantsIcon, Trees as Dress, RotateCcw, Download, ArrowLeft, Sparkles, Loader2, User } from 'lucide-react';
import images from '../assets/image'; // Ensure this path is correct
import axios from 'axios';

function ImgReplace() {
  const [selectedTab, setSelectedTab] = useState('top');
  const [humanModelImage, setHumanModelImage] = useState(null);
  const [humanModelPreview, setHumanModelPreview] = useState(null);
  const [clothingItemImage, setClothingItemImage] = useState(null);
  const [clothingItemPreview, setClothingItemPreview] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // For image generation
  const [isDownloading, setIsDownloading] = useState(false); // <-- New state for download button

  const URL = import.meta.env.VITE_BE_URL || "http://localhost:3000";

  // --- File Handling (Original logic) ---
  const handleFileChange = (event, setImage, setPreview) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setErrorMessage('');
    } else {
      setImage(null);
      setPreview(null);
    }
    event.target.value = null;
  };

  const handleHumanModelChange = (event) => {
      handleFileChange(event, setHumanModelImage, setHumanModelPreview);
  };
  const handleClothingItemChange = (event) => {
       handleFileChange(event, setClothingItemImage, setClothingItemPreview);
  };


  // --- Generate Image Handler (Original Logic - UNCHANGED) ---
  async function handleGenerate() {
    if (!humanModelImage || !clothingItemImage) {
      setErrorMessage('Please select both a human model and a clothing item.');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    setGeneratedImage(null);

    const formData = new FormData();
    formData.append('shirt', clothingItemImage); // Use original keys
    formData.append('person', humanModelImage);

    try {
      const response = await axios.post(`${URL}/api/generate-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.imageBase64) {
        const imageUrl = `data:image/jpeg;base64,${response.data.imageBase64}`;
        setGeneratedImage(imageUrl);
      } else if (response.data.text) {
        alert(`API Response: ${response.data.text}`);
      } else {
        setErrorMessage('No image or text data received from the API.');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      setErrorMessage(error.response?.data?.error || 'Failed to generate image.');
    } finally {
      setLoading(false);
    }
  }


  // --- Download Handler (MODIFIED) ---
  const handleDownload = () => {
    if (generatedImage && !isDownloading) { // Check if not already downloading
      setIsDownloading(true); // <-- Set downloading state to true
      setErrorMessage(''); // Clear any previous errors

      // Create link and initiate download
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'generated_try_on.jpg'; // Set filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Reset the download state after a short delay
      // This gives visual feedback even though we can't track actual completion
      setTimeout(() => {
        setIsDownloading(false);
      }, 1500); // Adjust delay as needed (e.g., 1.5 seconds)

    } else if (!generatedImage) {
      setErrorMessage('Generate an image before downloading.');
    }
    // Do nothing if isDownloading is already true
  };

  // --- Skeleton Component for Preview Area ---
  const PreviewSkeleton = () => (
      <div className="w-full h-full aspect-[3/4] bg-gray-300 rounded-xl animate-pulse flex items-center justify-center">
          <p className="text-gray-500 font-medium">Generating Image...</p>
      </div>
  );


  // --- RENDER LOGIC ---
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="py-8 px-4">
        <h1 className="text-4xl font-bold text-center text-gray-900">
          AI Virtual Try-On Using Photos
        </h1>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Example Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-12">
           {/* ... (Example section JSX remains the same) ... */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                <img
                    src={images.herimg}
                    alt="Fashion Model"
                    className="rounded-lg w-full"
                />
                <p className="text-sm text-gray-600 text-center">Original photo</p>
                </div>
                <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Transform Your Look Instantly
                </h2>
                <p className="text-gray-600 leading-relaxed">
                    AI try on clothes and swap them directly from a photo. Easily replace your existing outfit by uploading a clothing item photo and wear it on your picture. Swap clothes online maintaining proportions and style for a natural effect.
                </p>
                </div>
            </div>
        </div>

        {/* Try-On Interface */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* Left Panel - Controls */}
          <div className="bg-gray-100 rounded-2xl p-6 space-y-6">
             {errorMessage && <div className="text-red-500 p-3 bg-red-50 border border-red-200 rounded-lg text-center">{errorMessage}</div>}
              {/* ... (Upload buttons, type selection, generate button - JSX remains the same, including disabled={loading} for generate) ... */}

               {/* Human Model Upload */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Upload size={20} />
                    Add model & clothing
                </h3>
                <button
                    className="w-full py-4 px-6 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    onClick={() => document.getElementById('human-model-input').click()}
                    disabled={loading} // Disable during generation
                >
                    {humanModelPreview ? <User size={20} className="text-green-500"/> : <Upload size={20} />}
                    {humanModelImage ? 'Change Human Model' : 'Select Human Model'}
                </button>
                <input type="file" id="human-model-input" className="hidden" accept="image/*" onChange={handleHumanModelChange} disabled={loading} />
                {humanModelImage && <p className="text-sm text-green-500 text-center mt-2">✓ Human Model Selected!</p>}
                <p className="text-xs text-gray-500 mt-2 text-center">Use a good resolution image for best results</p>
                </div>

                {/* Clothing Type Selection */}
                <div className="flex gap-4 justify-center">
                    <button
                        className={`p-4 rounded-lg flex flex-col items-center gap-2 transition-colors disabled:opacity-50 ${selectedTab === 'top' ? 'bg-[#e8fb5a] text-black' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
                        onClick={() => setSelectedTab('top')}
                        disabled={loading}
                    > <Shirt size={24} /> <span className="text-sm">Top</span> </button>
                    <button
                        className={`p-4 rounded-lg flex flex-col items-center gap-2 transition-colors disabled:opacity-50 ${selectedTab === 'bottom' ? 'bg-[#e8fb5a] text-black' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
                        onClick={() => setSelectedTab('bottom')}
                        disabled={loading}
                    > <PantsIcon size={24} /> <span className="text-sm">Bottom</span> </button>
                    <button
                        className={`p-4 rounded-lg flex flex-col items-center gap-2 transition-colors disabled:opacity-50 ${selectedTab === 'dress' ? 'bg-[#e8fb5a] text-black' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
                        onClick={() => setSelectedTab('dress')}
                        disabled={loading}
                    > <Dress size={24} /> <span className="text-sm">One piece</span> </button>
                </div>

                {/* Clothing Item Upload */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                <button
                    className="w-full py-4 px-6 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    onClick={() => document.getElementById('clothing-item-input').click()}
                    disabled={loading}
                >
                    {clothingItemPreview ? <Shirt size={20} className="text-green-500"/> : <Upload size={20} />}
                    {clothingItemImage ? 'Change Clothing Item' : 'Select Clothing Item'}
                </button>
                <input type="file" id="clothing-item-input" className="hidden" accept="image/*" onChange={handleClothingItemChange} disabled={loading}/>
                {clothingItemImage && <p className="text-sm text-green-500 text-center mt-2">✓ Clothing Item Selected!</p>}
                <p className="text-xs text-gray-500 mt-2 text-center">Use a good resolution image for best results</p>
                </div>

                {/* Generate Button */}
                <button
                className="w-full py-4 bg-gradient-to-r from-[#e8fb5a] to-[#b4f321] rounded-xl text-black font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait"
                onClick={handleGenerate}
                disabled={loading}
                >
                {loading ? (
                    <> <Loader2 size={20} className="animate-spin mr-2"/> Generating... </>
                    ) : (
                    <> <Sparkles size={20} /> Generate </>
                )}
                </button>

          </div> {/* End Left Panel */}

          {/* Right Panel - Preview */}
          <div className="bg-gray-100 rounded-2xl p-6 relative aspect-[3/4] flex items-center justify-center overflow-hidden shadow-inner">
            {/* Skeleton / Image Display */}
            {loading ? (
              <PreviewSkeleton />
            ) : generatedImage ? (
              <img
                src={generatedImage}
                alt="Generated"
                className="w-full h-full object-contain rounded-xl"
              />
            ) : (
               <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80"
                alt="Model Preview Placeholder"
                className="w-full h-full object-cover rounded-xl opacity-50"
              />
            )}

            {/* Action Buttons */}
            {generatedImage && !loading && (
                 <div className="absolute right-4 top-4 space-y-4 flex flex-col gap-1">
                    {/* MODIFIED DOWNLOAD BUTTON */}
                    <button
                        title="Download Image"
                        className={`p-3 bg-black/60 text-white rounded-full hover:bg-black transition-all duration-150 ease-in-out backdrop-blur-sm flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleDownload}
                        disabled={isDownloading} // Disable button while "downloading"
                    >
                         {isDownloading ? (
                            <Loader2 size={16} className="animate-spin" /> // Show spinner
                         ) : (
                             <Download size={15} /> // Show download icon
                         )}
                    </button>
                    {/* End MODIFIED DOWNLOAD BUTTON */}
                 </div>
            )}
          </div> {/* End Right Panel */}

        </div> {/* End Try-On Interface Grid */}
      </div> {/* End Container */}
    </div> // End Page Div
  );
}

export default ImgReplace;