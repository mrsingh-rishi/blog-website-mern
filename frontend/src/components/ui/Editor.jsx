import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const Editor = ({ value, onChange, placeholder = 'Write something amazing...', className = '' }) => {
  const editorRef = useRef(null);
  const quillInstanceRef = useRef(null);
  const containerRef = useRef(null);

  // Initialize Quill
  useEffect(() => {
    if (editorRef.current && !quillInstanceRef.current) {
      const icons = Quill.import('ui/icons');
      icons['bold'] = '<svg viewBox="0 0 18 18"><path d="M10.6 8.4h2.8c1.2 0 1.9-.6 1.9-1.5 0-.8-.6-1.4-1.9-1.4h-2.8v2.9zm0 2.8h3.4c1.3 0 2-.6 2-1.5 0-.9-.7-1.5-2-1.5h-3.4v3zM5 4h5.3c1.6 0 2.8.4 3.6 1.2.8.8 1.2 1.8 1.2 3 0 1-.3 1.9-.9 2.6-.6.7-1.5 1.1-2.6 1.2v.1c1.3.1 2.3.6 2.9 1.4.6.8.9 1.8.9 2.9 0 1.4-.5 2.6-1.4 3.4-.9.8-2.2 1.2-3.8 1.2H5V4zm5.6 10.2c1.1 0 1.8-.4 1.8-1.3 0-.8-.6-1.3-1.8-1.3H7.8v2.6h2.8z"></path></svg>';
      icons['italic'] = '<svg viewBox="0 0 18 18"><line x1="7" x2="13" y1="4" y2="4"></line><line x1="5" x2="11" y1="14" y2="14"></line><line x1="8" x2="10" y1="14" y2="4"></line></svg>';

      const quill = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder,
        modules: {
          toolbar: {
            container: [
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'align': [] }],
              ['link', 'image', 'video'],
              ['clean']
            ],
            handlers: {
              'image': imageHandler
            }
          }
        },
        formats: [
          'header',
          'bold', 'italic', 'underline', 'strike',
          'color', 'background',
          'list',
          'align',
          'link', 'image', 'video'
        ]
      });

      quill.on("editor-change", () => {
        const html = quill.root.innerHTML;
        if (html !== '<p><br></p>' && html !== '<p><br><br></p>') {
          onChange(html);  // Make sure onChange updates state in the parent
        } else {
          onChange('');  // If content is empty, update state with an empty string
        }
      });

      if (value) {
        quill.clipboard.dangerouslyPasteHTML(value);
      }

      quillInstanceRef.current = quill;

      // Style the editor after initialization
      const toolbar = containerRef.current.querySelector('.ql-toolbar');
      if (toolbar) {
        toolbar.classList.add(
          'border-gray-200', 'rounded-t-lg', 'bg-gray-50',
          'sticky', 'top-0', 'z-10'
        );
      }
      const editor = containerRef.current.querySelector('.ql-container');
      if (editor) {
        editor.classList.add(
          'border-gray-200', 'rounded-b-lg',
          'min-h-[200px]', 'max-h-[600px]', 'overflow-y-auto'
        );
      }
    }

    return () => {
      if (quillInstanceRef.current) {
        quillInstanceRef.current.off('text-change');
      }
    };
    // eslint-disable-next-line
  }, []);

  // Update editor when value prop changes
  useEffect(() => {
    const quill = quillInstanceRef.current;
    if (quill && value !== quill.root.innerHTML) {
      if (value) {
        quill.clipboard.dangerouslyPasteHTML(value);
      } else {
        quill.setText('');
      }
    }
  }, [value]);

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const placeholderUrl = URL.createObjectURL(file);
      const quill = quillInstanceRef.current;
      const range = quill.getSelection();
      quill.insertEmbed(range.index, 'image', placeholderUrl);
    };
  };

  return (
    <div 
      ref={containerRef}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}
    >
      <div ref={editorRef} className="h-full" />
    </div>
  );
};

export default Editor;
