# 📊 IoT Telemetry API - UML Diagram Generation Guide

## 🎯 Overview
This guide explains how to generate high-quality PNG images from the Mermaid diagrams included in your IoT Telemetry API documentation.

## 📁 Generated Files

### Source Mermaid Files (.mmd)
- `entity-relationship.mmd` - Database entity relationships
- `user-registration-flow.mmd` - User registration sequence diagram
- `user-login-flow.mmd` - User login sequence diagram
- `device-create-flow.mmd` - Device creation sequence diagram
- `telemetry-submit-flow.mmd` - Telemetry data submission flow
- `system-architecture.mmd` - Overall system architecture

### Generated HTML Files
- `diagrams/index.html` - All diagrams in one page
- `diagrams/images/*.html` - Individual diagram pages with download buttons

## 🚀 Quick Start (Windows)

### Method 1: Automated Batch File
```bash
# Double-click this file to open all diagrams
open-diagrams.bat
```

### Method 2: Manual Browser Opening
1. Open `diagrams/index.html` in your browser
2. Click "Save All Diagrams as SVG" button
3. SVG files will download to your Downloads folder

### Method 3: Individual Diagram Conversion
1. Open any file in `diagrams/images/` folder
2. Wait for diagram to render
3. Click "Download as PNG" button
4. Save to desired location

## 🌐 Online Conversion Services

### Recommended Services

1. **Mermaid2Img** (Recommended)
   - URL: https://mermaid2img.com/
   - Features: PNG, JPG, SVG, PDF export
   - Quality: High-resolution support

2. **Mermaid Online**
   - URL: https://www.mermaidonline.live/mermaid-to-image
   - Features: Real-time preview, multiple formats

3. **MarkdownToImage**
   - URL: https://markdowntoimage.com/
   - Features: Professional styling, batch conversion

### Conversion Steps
1. Copy Mermaid code from `.mmd` files
2. Paste into online converter
3. Choose output format (PNG recommended)
4. Adjust settings (theme, size, quality)
5. Download generated image

## 📋 Diagram Descriptions

### 1. Entity Relationship Diagram
```
Shows: User ↔ Device ↔ Telemetry relationships
Type: ER Diagram
Purpose: Database schema visualization
Key Features: One-to-many relationships, cascade deletion
```

### 2. User Registration Flow
```
Shows: POST /auth/register endpoint flow
Type: Sequence Diagram
Purpose: Authentication system flow
Key Steps: Input validation → Password hashing → JWT generation
```

### 3. User Login Flow
```
Shows: POST /auth/login endpoint flow
Type: Sequence Diagram
Purpose: Authentication flow
Key Steps: Credential validation → Password comparison → JWT token
```

### 4. Device Creation Flow
```
Shows: POST /devices endpoint flow
Type: Sequence Diagram
Purpose: Device management CRUD
Key Steps: JWT validation → Device creation → API key generation
```

### 5. Telemetry Data Submission
```
Shows: POST /telemetry endpoint flow
Type: Sequence Diagram
Purpose: IoT data ingestion
Key Steps: API key validation → Data storage → Response
```

### 6. System Architecture
```
Shows: Overall application architecture
Type: Graph Diagram
Purpose: High-level system design
Key Components: Controllers, Services, Database, Security
```

## 🎨 Customization Options

### Theme Customization
```javascript
mermaid.initialize({
    theme: 'default', // or 'dark', 'neutral', 'forest'
    themeVariables: {
        primaryColor: '#007bff',
        primaryTextColor: '#333',
        lineColor: '#666',
        // ... more variables
    }
});
```

### Export Settings
- **PNG**: Best for documents, presentations
- **SVG**: Best for web, scalable
- **PDF**: Best for documentation
- **Resolution**: 2x-4x for high-quality prints

## 📸 Image Specifications

### Recommended Dimensions
- **Standard**: 1920x1080 pixels
- **High Quality**: 2560x1440 pixels
- **Print**: 300 DPI equivalent

### File Size Optimization
- PNG: Compressed with optimal quality
- SVG: Minimal file size with infinite scalability
- WebP: Modern format with better compression

## 🔧 Advanced Usage

### Batch Processing with Node.js
```javascript
// Example script for batch conversion
const convertAllDiagrams = async () => {
    // Implementation for automated conversion
    // Using headless browser or API service
};
```

### Integration with Documentation
- Add images to README.md
- Include in technical documentation
- Use in presentations and proposals

## 📚 Integration with GitHub

### README Integration
```markdown
## 📊 Architecture Diagrams

![Entity Relationship](images/entity-relationship.png)
![System Architecture](images/system-architecture.png)
```

### Wiki Documentation
- Upload images to GitHub repository
- Link from wiki pages
- Maintain version control

## 🎯 Best Practices

### File Organization
```
diagrams/
├── source/           # Original .mmd files
├── images/          # Generated PNG files
├── svg/             # Generated SVG files
└── docs/            # Documentation files
```

### Version Control
- Commit `.mmd` source files
- Include generated images in repository
- Use consistent naming conventions

### Quality Assurance
- Review generated images for clarity
- Ensure text is readable
- Test in different contexts (light/dark themes)

## 🔄 Updates and Maintenance

### When to Regenerate
- Database schema changes
- API endpoint modifications
- Architecture updates
- New feature additions

### Automated Workflow
1. Update `.mmd` files
2. Run conversion script
3. Update documentation
4. Commit changes

---

## 📞 Support

For issues with diagram generation:
1. Check Mermaid syntax validity
2. Verify browser compatibility
3. Try alternative conversion services
4. Check file permissions and paths

**Happy diagramming! 🎨**