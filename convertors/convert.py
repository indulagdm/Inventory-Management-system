import sys
from docx2pdf import convert
import os

def main():
    # if len(sys.argv) < 3:
    #     print("Usage: convert.py input.docx output.pdf")
    #     sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2]

    output_dir = os.path.dirname(output_path)
    os.makedirs(output_dir, exist_ok=True)

    convert(input_path, output_path)
    print(output_path)

    if output_path is None:
        output_path = os.path.splitext(input_path)[0] + ".pdf"
    
    try:
        convert(input_path, output_path)
        print(f"Converted: {input_path} → {output_path}")
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False


if __name__ == "__main__":
    main()
