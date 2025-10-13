// backend/routes/doctor/uploadRoutes.ts
import { Router, Request, Response } from 'express';
import { protect } from '../../middleware/authMiddleware';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

const router = Router();
// Use memory storage to capture the file buffer before sending to Cloudinary
const upload = multer({ storage: multer.memoryStorage() }); 

// Configure Cloudinary using environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// @route   POST /api/doctor/upload/document
// @desc    Uploads a file to Cloudinary and returns the URL/ID
// @access  Private (Doctor Only)
router.post('/upload/document', protect, upload.single('document'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }
        
        // Convert file buffer to base64 string for secure upload
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'hms_emr_docs', // Store in a dedicated folder
            resource_type: 'auto'
        });

        res.status(200).json({
            public_id: result.public_id,
            url: result.secure_url,
            file_type: req.file.mimetype 
        });

    } catch (err: any) {
        console.error('Cloudinary Upload Error:', err);
        res.status(500).json({ message: 'File upload failed.' });
    }
});

export default router;