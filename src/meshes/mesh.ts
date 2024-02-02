import { Vector } from '../math/vector.js';

export class Mesh {
  vertices: Vector[];

  edges: [number, number][];

  faces: number[][];

  constructor(vertices: Vector[], edges: [number, number][], faces: number[][]) {
    // vertices: list of positions relative to (0, 0, 0)
    // edges: list of pairs of vertices, referenced by their index in the vertices list
    // faces: list of lists of edges, referenced by their index in the edges list
    this.vertices = vertices;
    this.edges = edges;
    this.faces = faces;
  }

  static fromWavefront(wavefront: string) {
    // only parses vertices and faces in .obj files
    const vertices: Vector[] = [];
    const edges: [number, number][] = [];
    const faces: number[][] = [];

    const compareEdges = (edge1: [number, number], edge2: [number, number]) => (
      (edge1[0] === edge2[0] && edge1[1] === edge2[1])
      || (edge1[0] === edge2[1] && edge1[1] === edge2[0])
    );

    wavefront.split('\n').forEach((line) => {
      const words = line.split(' ');

      if (words[0] === 'v') {
        const coordinates = words.slice(1).map((word) => parseFloat(word));
        vertices.push(new Vector(...coordinates));
      } else if (words[0] === 'f') {
        // get the list of vertices for the face
        const faceVerticesIndices = words.slice(1).map((indices) => parseInt(indices.split('/')[0], 10) - 1);

        // construct the edges for the face
        const faceEdges: [number, number][] = [];

        for (let i = 0; i < faceVerticesIndices.length - 1; i += 1) {
          faceEdges.push([faceVerticesIndices[i], faceVerticesIndices[i + 1]]);
        }

        faceEdges.push([
          faceVerticesIndices[faceVerticesIndices.length - 1],
          faceVerticesIndices[0],
        ]);

        // get the edge indices for the face
        const faceEdgesIndices: number[] = [];

        faceEdges.forEach((edge) => {
          // try to find the edge in the edges list
          let edgeIndex = edges.findIndex((otherEdge) => compareEdges(edge, otherEdge));

          // if the edge isn't in the list yet, add it
          if (edgeIndex === -1) edgeIndex = edges.push(edge) - 1;

          faceEdgesIndices.push(edgeIndex);
        });

        // add the face to the faces list
        faces.push(faceEdgesIndices);
      }
    });

    return new Mesh(vertices, edges, faces);
  }
}
