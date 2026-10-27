import Foundation
import Vision

// Extract slide text locally; timestamps come from sampled frame filenames.
guard CommandLine.arguments.count == 3 else {
    fatalError("Usage: read_slide_text <frame-directory> <output-json>")
}
let directory = URL(fileURLWithPath: CommandLine.arguments[1])
let files = try FileManager.default.contentsOfDirectory(at: directory, includingPropertiesForKeys: nil)
    .filter { $0.lastPathComponent.hasPrefix("second-") && $0.pathExtension == "jpg" }
    .sorted { $0.lastPathComponent.localizedStandardCompare($1.lastPathComponent) == .orderedAscending }
var records: [[String: Any]] = []
for file in files {
    let request = VNRecognizeTextRequest()
    request.recognitionLevel = .accurate
    request.recognitionLanguages = ["en-US"]
    request.usesLanguageCorrection = true
    try VNImageRequestHandler(url: file).perform([request])
    let lines = (request.results ?? []).compactMap { $0.topCandidates(1).first?.string }
    let name = file.deletingPathExtension().lastPathComponent
    let seconds = Int(name.replacingOccurrences(of: "second-", with: ""))!
    records.append(["seconds": seconds, "frame": file.path, "text": lines.joined(separator: "\n")])
}
let data = try JSONSerialization.data(withJSONObject: records, options: [.prettyPrinted, .sortedKeys])
try data.write(to: URL(fileURLWithPath: CommandLine.arguments[2]))
print("Extracted text from \(records.count) timestamped frames.")
