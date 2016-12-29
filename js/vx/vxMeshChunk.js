

function vxMeshChunk (name) {
  
    // Mesh Name
    this.Name = name;
    
    // The Owning Model
    this.Model = null;
    
    var col = 0.75;
    this.meshcolor = new vxColour(col, col, col, 1);
    
    // Place holders to determine if the Hover index is with in this
    // mesh or not.
    this.IndexStart = 0;
    this.IndexEnd = 0;

    //Vertice Array
    this.mesh_vertices = [];
    this.edgevertices = [];
    
    //Normal Array
    this.vert_noramls = [];
    this.edge_noramls = [];
    
    // UV Texture Coordinates
    //this.vert_uvcoords = [];
    //this.HasTexture = true;
    
    //Colour Array
    this.vert_colours = [];
    this.wire_colours = [];
    this.edge_colours = [];
    
    //Selection Colour Array
    this.vert_selcolours = [];

    //Indices
    this.Indices = [];
    this.EdgeIndices = [];
    
    //Buffers
    this.meshVerticesBuffer = null;
    this.meshVerticesNormalBuffer= null;
    this.meshVerticesColorBuffer= null;
    this.meshVerticesUVTexCoordBuffer= null;
    this.meshVerticesSelectionColorBuffer= null;
    this.meshVerticesWireframeColorBuffer= null;
    this.meshVerticesIndexBuffer= null;
    
    this.edgeVerticesBuffer = null;
    this.edgeVerticesNormalBuffer= null;
    this.edgeVerticesColorBuffer= null;
    this.edgeVerticesIndexBuffer= null;

    //What is the model type
    this.meshType = MeshType.Solid;
    
    //Should it be Drawn
    this.Enabled = true;
    
    this.Texture = null;
    
  this.TextureImage = new Image();
    
    // The Max Point of this Mesh
    this.MaxPoint = new vxVertex3D(0,0,0);
    
    this.Center = [0,0,0];
    
    this.IndexStart = numOfFaces;
}

vxMeshChunk.prototype.getInfo = function() {
    return 'Mesh Name: ' + this.Name;
};

vxMeshChunk.prototype.SetCenter = function() {
  var cnt = 0;
    for (var i = 0; i < this.mesh_vertices.length; i+=3) {
      cnt++;
      this.Center[0] += this.mesh_vertices[i];
      this.Center[1] += this.mesh_vertices[i+1];
      this.Center[2] += this.mesh_vertices[i+2];
    }
    if(cnt > 0)
    {
      this.Center[0] /= cnt;
      this.Center[1] /= cnt;
      this.Center[2] /= cnt;
    }
};

/*
function handleTextureLoaded(image, texture) {
  console.log("handleTextureLoaded, image = " + image);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
  
  safeToDraw = true;
}
*/

vxMeshChunk.prototype.initTextures = function () {
  //safeToDraw = false;
  /*
    cubeTexture = gl.createTexture();
  cubeImage = new Image();
  cubeImage.onload = function() { handleTextureLoaded(cubeImage, cubeTexture); }
  cubeImage.src = "img/txtrs/txtr_default.png";
  */
  /*
  if(this.HasTexture)
  {
    this.Texture = gl.createTexture();
  
  //this.TextureImage.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAIAAABMXPacAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AsJARkullwBWQAAAPxJREFUeNrt27ENgDAMRFEHsSMzMiXMkOauyPs1cvNkF0hZ33yz0zt7PZvfnzb/GlUDAACAAAAQAAACAEAAAAgAAAE4o9v//e58G+AEARAAAAIAQAAACAAAAQAgAAAUaHkf0J1vA5wgAAIAQAAACAAAAQAgAAAEAIACeR9Qnm8DnCAAAgBAAAAIAAABACAAAAQAgAJ5H1CebwOcIAACAEAAAAgAAAEAIAAABACAAnkfUJ5vA5wgAAIAQAAACAAAAQAgAAAEAIACeR9Qnm8DnCAAAgBAAAAIAAABACAAAAQAgAJ5H1CebwOcIAACAEAAAAgAAAEAIAAABACAAv3iGiehVDD+jwAAAABJRU5ErkJggg==";
  this.TextureImage.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkYAjcSIhepMQAAIABJREFUeNrtnXmcTfX/x5/n3rmzmDEzlrFvY5ddZaxJSCmhJBJaSJQthYj4ZSlLIrJWtKFFKVmyZo+yEyE0ZGcwZsxy7/n98f6cM5fG3DMz986Mvt6Px33MvXfudj6f9+e9vN4b3KH/adL+w9cWAehACcAF5AM6W3zvSeArdf8ckAScV59zh3IY2QB/dX8CcFBtvNxsNh27n47druMfYOEWKK+1+8nN/bMgGRgD5AcCAPsdCZB9VACYC9QDggCHeUktnoEyVaFKFNj95AYQEGhtSRLiUpYmIR7O/QMbF8P2dXD2hPFCFxAHnALeBj67wwC+p0fVYldQmw5RzeD+NlCwOITlg9zh4HSCroPuJYmtaaDZwGZTSuEkXDgNW36GpZ+7v3I/MA8YD1y/wwCZ/2060BLork56HgoWh9pNoWodiHpQTmhSYvb8Qj8H+AfCrg1wcCfs3QJ7Nhv/3QjMyOmSIacyQC7gPnWawgkOhcpR8GRPEe3X47x3ur1JjgCIj4XPxsLODXD+lPGfbsAK4PgdBvBMlZQohdC80LYnPPqsLOztRAGB8OdumPwanP7beLarYuq4Owzwb6oB7DAfTV0J4fn/G36KfyC8+ihEHzaeeQN45w4DCD2mrPlwHP4wcTHkLZQzRXymnFU7xMbA1EGwcyNALDALePV/mQE2APUpVBJ6vA1V6oh+/y+Twx+iD8G302HTUoCjwMvA0v8lBugNTAKg0+vw8DPitnn7xNntsuA2O+xYL48Bjv0BcbHgcpMyLifUaCDP6TpUry/PJSeJW+lM9rJaCICtq2D2CLh0DuB9oN9/nQGKAAuBKMpWg3HfQdxV7/jpNrts2PlTcOo4nDwCR/bAxjQP1jEEzSt+y1dUiYKSFaBGQyhcEoJDIVduhTV4QU2F5YORLwimIFQf2PRfZIDGwGpsNmjfBx59LvMLqGmCA0Qfhm8+hN03rFscEI/AxK8BwcBEi588SL1/AOAHhKq/gjYWiYQnXoLqDSAwlwBEmZJgmqi+Xg8aB+IDJSX/MwzwM9CM8AiY+UvmgRtHAGxdAeN7p5x8oa+AccAewIlg9waFAz0tfPomYO3NkI9aqxBlwb9uMiDAs4PgoWdEXWSGdB0mvw5bVwKcBgrfzgygIUGTP4B8tO0JbV7MnM48/Td8MBD+2qeTnGT89rnqpJ5Vj2sDPYBaQFENQnUzTmCZPkcihzpQDPgCwf6nAt+o1+QFOgDtgQYAFC4FT/eDBo+ok5yB5bX7CZo4qhvq+58AvrsdGaCWQr/yMngGVKsnejO9FJwbVn0LC6fByaMA1xCIdRLwNxLmHYZAxXcb19SsHDxUEUID4b7SkOSEyiU9LT50nAXzdoKuEw5cBlYVzs0Dl+Lheoo8+VNJmaGKwcOB1up3RJInAhq2hG5vwZVLGdgVG8Sch34tIOG6T3EDXzFAK2AhgcE2hn0sRlR6KShY3KRPxxoRuItqEcYBgUpHPg5EATQuA3VKQavKEFUJSFQKQE//imj9b1iflSH+NIkeChfj4Mf9sPow/LgPXVdWiC46+1PFFK2VNX+fqR6aP62CU+n5Mbp4JKO6wYHtAKOAN28HBngW+IiAQBvT1loMwbq7bzY4Ew3v9YO//wT4B5gJjABKqtPf3Kahl82PNrgJdKmnNL4z8z9eBw6ehUpjQYn7F4EztUvg+LU/khpiA4Lgl93Q/Rs4d02YQ+ntx4HNyuj9CIjEZoehs6FcjRS7IT3SYODjBorYXxmyek5lgCcxMmk+2iQWcnqNoE/fgZ8XoHRuP2CyEvNLgXttGnSNghmdkICr7gMWtsGbP8GoVYDEJu4Hpk17Al6qm7rqGLcSRq+GmHjz2eeVfVLDVIWFSsCEHzLwe2zwWitDBa4GmuREBrgL2EeRSBi7MH2crmmwbyu808MAXGYhIeBwZZFXA5jTHjrWAj+7jzbejZJdEDRI/qp1Wp/LnwbXxt7kW7iRS4ffTsArC2FbNABXgeZKIrQFvkbToE5z6DMufTaRrsO30+C7mQBrgAdyCgNo6scsA/z4Ymf63h0SBmO6w68rQNcvAXWRtK5N6j6fdoC21SDI3/cb705HLkDZMaC8jK+AYy/VhWlt0/gdmsAbe07Dw7PgnysARAOVFY7wNtCTgsXloNj9rB+WgCB4twf8tkZH138GHvKCsMv05tcEbQUOfz8+2pS+t16Nga4NBAXT9cnKtWqulrfupNaQPA463QNBjqzdfIAy+aFRaQDGIrH82dM3Q1xi2kaEpkG1wnDybfjxeVBI4xXgLQT3b8+ZaHi+roBXRsqaJ0qIh34ToXp9Ta1T/5wgAS4SGJyHaask7GnV1921UU6+2OttgZXAHKBdVAlY3QNy+Wf9pt9MsQmQewgA7wGjgfM96sGHT6bD6AyDDlNhvgjHRGVT/KG8hmJ0HSpAUkK8dZU5tCMc2QvwsJK+2cIAMUAooxdoll09u12CIO/1RfnZRYGqwDKbRliPejClrXcsem8ZhO3mwte7zPX6Euhw+A0oky99K73jBDww3TQUewFTFBNUoWo9GDzDHdX0TC/eB9euAJQig9lGmWEAgXcHz5B0Lasnf9oQ+GURSJ59BPAx8FxECKzvCRUKkPMoF2gCIu9RANflttXI9fXztzYIb0XxSfDgTNhwFJBgVKRycYeRpwC8/5PkGlpFRzvWhMTrZ4GCWWkDNAaa0bYHVKtv7R1+Dhjb09j879XmH9HguWfvhRNv5tDNB4iHya1BSapkYPw3u+FaBlIXghyw/hXTNigFHFC2QR8unYWu9a17B4kJMGQmSIr891nFAEWA1YRHQJvu1uLkdj+xXrevAyneaKMuvPSEx+CTp8Dfj5xLOrySwuf7lSXvHL0qgzJUh0erwPxnAElxT1KgUV2SEiUq6LIYKa1QC1p0NtDXbr5mADvwNTabRPUsfYMdvvrAffOHAL8C5We3g36NuS1Is8OwZgCUU9u+ZPQqSM6oreKCp2rCkTdA07AjKWKHgMe4chEGPC41Dp7ImQzdR0DxsijQrIAvGeAloB7t+1gL6dr9YNsqWDjDEPuvAeuAeye0RHuhdg4y9ixsmJICfkgeXzuAmVsyJ1ki88LxIWg2kSTngW3oemdOHYMRz0ro26Orchn6vgcSI/nFlwwwhbLVJJnDin25c71h7Z93E/v3TmiJ1q8Rtx1FhMIDZQEJSl0H1o9dQ/qDzTd5dMXDIWYk+MlunAIWAxP4fS2885K1DypcCvq9B1DRQE69zQAbAEnjspLJc/WSQLvi6kUguHiF2e3QXm10mxYlukzjDaAR8OnxS7D/ROY/OncAxI0xmeB3JS2/Z/svsH+bZ7RQd0HtZsajXUgGlNcY4DGgPp1et5bDFxImQIWAHsWAbhp0fq42vFCf25py+UNYoJKGMBugy3zvfLbDDsskZyYSWKKk5glGdRMx75FBnfDJFqOGcaw3GWAuhUpK9q4VmTamuxRQCsJXBZh5bwn4uL2yd29z6iawRxUk46nvoXPe++wm5WFEcwyEbyLS3wD6t7Imef0Dof4jIOlvhb3BADWAcHq8bS2hYd9W+HWlYZGuBJZFhMDmXvxn2iuMewr87ehIkGjH5euw/YSXPtwFw1pCmyomWtgAaMjVS/D5BElz90SvfwB+Dh3pZZBpBtiBw1+KNjxatbrofd11CegDzLFphK3vCbb/Ui+SeKhSCA2pXF4H8NwCMh9aM+g6fNERwoKwI4jrBmA5y76AQ7st2F8xUK+FBnTJLANUAqRcy1PFjs0myRwCDNVFUrba9aiXgxG+TLhvQ5piWNwA7+8+BTHXvPcVQQ7Y+DKGa7cdCf1eZOob1qWA0KqMMkAujCrdvIU8f+GZaCOTZxYSz58UVUIFdqywoV3dHDfdAmHGZrm//STSmOXm1xjvzUIp8/g95t3BSt1xJcG731G5CHz8FAA1FQDVlX+Owtx3Pb/5ykVo1RUkV6NiGs76LZ9vDiy1VKUbFAx9H4G//3QpoGQZ8OC1MZDLcdMmO+BaDPywD6ZulCya89cgNhGcLjibgSrwIqESNQ4NEAv9tfsh0Qkdo9T3JvsAcPKHu0bCH2fZC1QHnAMbwzstvW/raK8ZioEg4Cv8A59kwV4pb/MklTtUQyGM5dPDAACXCMsbzoerPcvDHeulSEP0/mRAH9MCBrWC43/Dkj9g1WE4dhF+/7extEad689kWfkLOGFdGKvsW/EvOgG5kaANAAVCoGZRuKc4PFge7qsCJGSeIXRg0E8wbg3xukjLowF+lLr+nnJ+vUj7TkPVCaDrvIzkF/5JhRrw1ty0DXObDZZ8Dp+NdaqDaZkBWgI/0GUgPNgh7V8XHCoRrPOn/kaydgH0puVg5aEbXnkE2An8hoRVf3L/FCRrxoUUdqTnDJ1CMoftpsoSyouEbp9H6gXME9CzHjxcEWqXgAJhGWeGzcehnqjaQkg6+PSzwyEixPsqp/Yk2BZNkjok47DZX+OTLZ5Dx+dOinSWtPUuVhlgMcGhj/DZds+dOTYvgymDQKJRRsrrcOBptSFfI5U1AHnUxpRDKl66pvaReS0mE+s6XEo9iWaGMp5GKyTyrDq0L6pbCYVO0rchvFgXKhV0O9pWKQQ0QWoXKQbQ1/aARmW8zwCnr0LhEYAUo8wBoqnXAnqPTTsi6/AXUO7gDsOui7fCABep3SwPfcZ50IMB0LcFnDx6EUndTu2zWylY08QAbZrcXDqMfAiuJcLI1m4gUXo2QX3LX+fh09/g9BX4aKt8ts4NEjJG/UZ36fKN2jg7wMTHoG+jdHy/A1rPhEX7zMSOmDebEvZ2Cx9gHjZoPh1+/pPLSLa09FaY8jPk8eBmXb4APZtAKplDqTHAo8CPjPtOqmDTootnoFdzFCAyzs11nAuUVifeBvBiHUnprhABwQEQEnjTQnsj98/taq4liCGo6/DmUpi22fyW4JtOgb9ijG+Aen42qTuY1hFLjd6+3A4dvzQ35ejjVSn17QukO1PICh06D+WlQGw0kpNwjW5v2XjgibTzB5KT4Lk64HJOVnZamm7g2xQsLt24PNEHA0Fq9cYBfZFavf3AvW2qkG/DK9iih4I+CWY8BfeVgYK5IcRfnRD3Hpxe8s+NW7A/5AmGkAB5qlQek0VuXqlEZUfUB8oku/h6+mYI7Q+vLyalLvgWVCgUgDD18KuFe8hUdDAtKlcYWgtC+LJiz63MGiH9CtKUVP5QtzkKm3F4YoAK1G7qGfhxBEiVboq+ndgwkuLresqGL+wK9UpBsTAl2p1kaYZvTDz0XggBA2H6Zjh2iRXKwEzLW/8LifOXv5rAN+PXQq7XYfYWdYWpUMk85t1iyhjl7DkfXVQSvNbIZLjqSBU0rFno2VjqaGaQ35cWAxQAgqhax3PgYesKVIn2JKC3TUNf9xo0LK02PDmbQr52yeDNMxQ+2EAS0pYtEHgQ2GZV2iJlbsXik/i929fQbBJciEuTAbqrteDwed9dXv27RLopdHAncIxtqzx7A3kijFK9mmkxwFxAOnCmqWs1w+9Hif3Hy+ZHy9bmqJqUgBd4E9pJb87zSr8/7eHUp0UngXuAASsPoecf9m+gyi8lYcdctN2nfHidCTBJElSdirEPsnGJGORpkcsFEUUBBt6KAWxAPaKaeS5QSIiXXD9JESsARA1uQrYWcfx8APwHSqUuEouI8OLHj0NCvxQcDt/vdbMLXNBdCkZrG3jH0Ys+vFAXPFLJ8EFoZh7azcs9v7d5B9R1FEyNAfyBUO5vk3a+n6ZJREoKGL5XWLiUaGeTyH9jCTSfha4QxNzAFh9800W17YfbzIFm0zHaVd+s6rR/ruC9yGBqhmeYefcrpeIOsnyelJJ7ZgCAFqkxgAjwwh7aaNjs8NNc49EZoG7jMmRPcqcNmn4I76w2wZjiSHatL6kc8ObKQ/DQZDmHLSub/wsD/th/Bt9OEtDhk/agVEAeYCfH9ntWA5oGeQuiDEjtZgaYAEDuPB5EkFPq+lImatRuWTkbGECDJ+fAKoGbRyLpU1lFo4CRyw/CzLVSCOquIG2+/nYdnk4x5UoD33L5olEmlgYekAwFioH0F9BvZoBHQfOci57SAXucofeiSmT95nf8HL6V3IgPFDya1TQU2NH9G/jsd4/Iqi+WgEA/UwosAWC9h+YTzmRDwpdNTQWUp8UznsuSTplI4h7DD61XOWvFfutPYN4O0KV1TG+yj2oBewcvIQGJOcQAmisLjOGLcWbTKpcC4+CHjz2/sXZT3FENgwHEYi5T1UN40S4dOKWJohOo1awcXg9/prX5jabAor2gS8Jkd7KfqiKNJA3RuWf7Sd+hgSB4RKER5kNjQsUSSzWFKfB+B3cGkF2vEpU2AGS3w6FdIFh6MlD0oYr4BPdOjd5eDuv+AqSY8lVyDrkfgW0+/aZcUHq0+cg9U2cJCfGe6wciK93wmw0GKIHN5rlThZ/D8DePKD0UGhqYBf6/BicvwzBxddcooy+nUhGffbI/tJ8JV8RfawJccPtvDLGXdY8MkJQE+QtjuO82E17QLDBAyv8/VWLDcV9p369oXCIUe1vsWCRZJScnmD8SmdcHXpENvv4NFkiXkelIt7AfkeIUA/vQPELCLqfhCdwgAfJZOsY71hn3Lhk6L8nX7p8NnphjPgoyDZ6cS8n5cnmfRdcfgXafAtKltAcSuHrUYed5pHexwN2fj7dWRqZmLRoM0Bm7n+emjikS4EtU42WP7VczSSsOwLKDgHTwTuZ/lJpMB6TbWAW1+ZE/dYU6JdGQCJ/kUXoCgxKvG7GeIje7gTmOriRIOxUEhn33Ntkrr579JKeEtJWkvRtJt4tc/AK0qGi9j8SNEkAnNRzAMx37I+uW0SH+Pilzf28XqlWjaOZllY4EtnK9IZlNSNBtIPDWg+XhkVthL+sXpwuPSh8DXLuaZav45VZYI0O23kDqEy+odXksp9sAeXNlzjPSgegYKDzc7FRaGEnV69O6Cizvk4acuXA6XXikLQOi41hWnP6+iwBJeBgLrMkTRN4QSYTom8MZoHzB3Jn7gLNXIXIUOHWcSvoVAT6uXQK/TztwU17vDTQlvbONMmID+Hxi9qDv4VysudkvAWFre0K7GoB0KMupVBugXiYM4/gkcXkVnByhbr877LD+ZWkkkQYFpPf7MsIAxX25golOeH89APORfjfTKkSgVSsMtYrmeP1fE6BOxQy8U4O1R0TnK7GfD+n6dQDgyijw93z0fNwlzOVjp98G49ZAgkix15DRLRwYJP92m9hRLYcyQO/8wRnwA+yw7AA0ngZIGpqGQN3vNoyE6++YkT8Le+TyIQPUaODT1bsaD29K19u1SDVPx14NUgyq/g+bLy2ZQxmg6JCmpC84FgJPfiKdxZH8ymLI+PkhD1eEdf0gID09FNv3SddkEtsNMsiT+Zgad3krAm43M3tcCM69COD9Vu5OMURI66MHcigDhN1dzKIHYJP4RslB8E1KXkNJpK6i/2OVYUlvz8z0r8YbTgs9eNwgf4MBTuJMggQPtQApkcJwVInR7qPeg09GSyuDPxUT1B3Y2Mg9NRwsKC2IwKM5cPM/BCiX3xqzz9wkxl50DIlIedr/IUG2Sp8/DYu643nGuF2qhZSLXOZmkCdV8g+EDYtBpQAaDPCVJQlQ3VQBnVEFnw4vYYkT1pp3K6nFCO9y7036VIfBMiylbA5kgB61ikIhTxl1OlR9V2YNAdt0KZY9CZzzs1F6RXfoeI91NaIkwHrTO2vXyzMTSMDodGaMwAHGnW3eaI4UABMlzvQbEqQY8ERVqJRKYPWxu827w3PQ5hcD+PIZ0kQAfzkCfgNg72kAOiq3cRqwNcgBsaOhabl0GJF2cyKJTYFlFno360YbuRtUwDmcyZ7rAZKTJGkkpdnAeT9b5tMBdh0VfUjKkKWA4c1vsZguqCoda57MQQzwF0jha6rATizcNxXunwa6TixSSbxO6ftOXe5BuzIqncae+y5IaDiJoGBrKmDvrwAL3BlALIdz/6QdSnQ6jRmAoeq9l+dsAy0z6U+aafmfR5ovrimUG6rcqsNdIgyTGpy71O/IbioLOOY/k4oG9Yde30HB4ejrj5KkXNvcSP/E6FwOKn3ZEeZ0NjuEpovGLzHv7gZ6WJrYctmsW7vkzgDy7MbFaRcXOJNlirbwnh2I/uUIt2g+YpFywWLp6/GNOhm5JrZK+y2tUgIhK3IAA8zM5YCnainrX5lS83ZA/kEwZSMg3VCCkWYZu4FxDSPh6mjoUIsM51TO3+kuFymBf6BnCSCnH+BbdwZwAU62r7tBP6RKklbsEA+WOYlOMl55B0xI4eIpQPsAP3i8atqulMMBHz4OSHg0JBs3/wmg8cAH5PfGxMPSPyBwIDz9BVyI4yDSUbQtUsFzPNifqvOegXW9lQGXQf3pdMEBmZY8Sz1VgbY9PL8xpc9g7M1G4Dg1ojVtCjal7htKZzPpl4yv4GxhyGhgHzA6l8PC8AgXdLnXMIOyVQrMrhABw5rD4J+kIrnFbPSEZKKVNKuIYPnXgSeGNIHYcdC+BplOGUt0msjoJxjxkTJVPL/xTDRIkO1fSKBUBkmP3zREdm4jtfh19cyfqw+TsaiCDY7LbOW3lfvHouetnYpcATBLzMA63Jgdm5UUHh0DQQNgjIBYC5DysBJKOsUCa4qEQsK7MLIF3umVrMGmYyIF1OF5iIBAiPRQoOEIgGMHQAZ2/IsBrgIut8qfWxuCT5g97PMCe37ch57+OBT8eUaiX0hC47NhgdCwnHXgqFOKSxidTQzwSFwSi64n00ttenuke8dJ4JsqhQj+vS+cHK4COd7KnraJilF0AmjCXbU9e3GBQfDPUd3dXLXdiLMRx68r0m42oLsEEBJvoQMwXQftrxPp5+KuX5mP9gCPlMiTPtEY4IDt/eTSuEXHMR/TEoXi7UNyJHVgTFQJiqzpAXuGQK1ieD1BNCHB7FMwUanBuylf3XNTj01L1crzfmoM4AROsfRzzwMgU4ZCtwdWapDYYnb6LsLlkj57SHkXQOW2VdN5SnRpAllDAKPJCkTKKiqqNn0vsDp3AIOalYf4d2BLf7i/TOaM47QOzi9/GVfPQGQGEzzU0fN7vzPsRf5IjQEMXQy7NngQQTZ4dhBIK/NwHSafu0a6UkWuJZpJD2OBpwC61snYmvzwvCkFlvlww8OQYM1Mtfgn/O1MLRBC5YVd4Mo4+Lm7Ctv6ciaCHSZLvkSC+qYeVK8PwWEeGMcGJw6ZANCtGECaqxz0MABa12XUqVBr4NOLcTJCPQMMEAM8Wr0IFMlg6mfxcBjTAk1ZwxPd/lUJOIeEljNSSlYfSUfX1e88hkq6WNgFEsbBmeHQpqry5bOgKDTmKvwk5/ct9VQhqtaDJA/ixqYZOZ0/psUAAPvZu8XztKrkJBlUBMOUDj89erW5qR6NmPFrzUcXgLvvKUamMmkHNZEJ49yYMzirbH7yRwQTobwcHRnifBmJvf910+2s2ugr6rUbgDF1SsLUNnD8Tbg8EvT3oE01sr4+yQbj1prI7VikPgMe8zDES9NgmWk1LnX/V2oe9zz2bH6b+FjPnaee7gcT+kQqKfB4TDybfjshPXjTPA1+MEGwA6O/WaXIfJk8QboMoFSx9XPK/95w+Dz1t/aRMPLFONhzitzHL8GqQ4Tab4JuE5zQq4FkJBUJhfzBULYgKd0FXW6wWTZQQqIZMl+q7J0nadrOM/rncsGcd0AqiS/eZFL828QD4mn6JDw3xIMzHiIj0C+dW4dM0dLvLQ6/9k47pHAuFgoMB+AVpbcPr+wOTcplcoU02HocoiYDMnnrHiVh8qx/Ga1BpJvcu4W9oifl0IlmGnT/2pxT6FDqaS3vL4EID/WocVehW0OUilzrSQVcBzayc4PnUrG4q9CwJUhpUmPg+W3RsOd02m9z67f3ISq5o0ktLyySDrVLwex2Jkz8HpJcefmxj91yCl1KiKZyy7GTbXRT93+jDulagkOhqId2vn5+8KlZVLUjFa2SKs3g/Cn4c5dntuw23HjwkYKGrz48izQbJETHgELJNKBHZF6812TCBS9EKbgV+gHPAA9fioegQRB3m04te+ZLM2T+LkZjjCk/ywDptCj2iqoWYpWyfSwxgHgDk1/3/MuuXDRcwkgklt/8nyuweNet9f9Hv5rqxwXkL5ffy3pVh3nPQKm85rXcgxRVEvzGDdnFtwf5wbd7AOlEug8YjyMAAoI8v/fwHuNey1vYlbekbpz+G0sx5uZPG8l7K5ShEd3yY1JaKKciOJSlDUCXe3zjOx8dLECRpvEBUlJWESDfsCwoa/ei5V/8Lbgu6zNKuaUwfbVn4y8kXGY4ysmPTy8DSJTt1Udvysy8BS4wdDZIbKAtUBmgw9RUzEw/s8mBkU6aLyTAd+u3/VWoUwI06WrWFKgdnwglRsKRC9na3NQS7T4JJ0RwP6UU6zBqNITAYM9icInZz7FyGvx1SzoOdCX6MMTGeGaAcjWgUAmQpAcHMHn+TthxItXTD6roA6CiL8fK6bCpN1QXQ3kKUF6HxmeuEl92DPq2v8mxRfJxiVBdYrTXkL6Mq/Bz6PS2MBU2JBzmT0JhNCczwgCCCQBMHeR5Vp2mwYQfDP/vbWQwQeID082IX4qPIRSgfFmcvj6GOux41ezs/TlQQA16io+aDFM35EAm0KBfStu/EGAEUJEeozSP3hnA97Pg8kWQETlklAHigDfYuRGiD1n74XWagwRJngLuj4lXTR7Uyd+aMrDkfVTn6mJhWbOmx4ZAYclnWYCMVc0LbHplIZQdRRaUvVqnudtMn/8zA+ykdGW4vzUenVWHv9EzcCMe+iZb4ft3gFi+ne65/QhAn3FQsDhIcecfQK8NRyVjJpUFdgHkzsLUzn+GQbvqakHFYK0PtD5yAbR+EqPIbrvg/DV4dj46UiTTWRlx/gyY6nmQB8Da76RPgIUOqlYF3yw2LYVRAEpvAAAJ/0lEQVStqzy/0umEsQuN8qM9Su9+PWY1LPj9FjOEs3jFFzxv5hTWRPD/RaiC05DB6FM3krWB5Zs2v5AJrVAB+BgIZehHEJrXgtdgg5nDDdBnjbcY4FXgKLNHQJiFkJ3dD/pPAimY2IOMYTnY/nP4bu+/UMespyTo0RA29QIkZqAj6d0asLnXd9Bwoiq6yEpoMEDKxZw6yUhTiDbAczRsCZWjPCd82P1gQh8J1MELFr1My/Qyl87ByBc8r4qmQa1G0HUoSFbsCOWDn1PBjMXqleOzTc46oW5JieyVl4KOhcouqA/03XCUuKL/B1/vzDqjr/ibZml8DXX6FxJRFF4ejaXOH8f+gN/WgBSa7rD4temiiUBfPtos+WUeOToIRjwHezZBylhZd0p8sQ6OGU+RPfMG3LCJ+ybD+r/MuWN5ld49BpSsUQRWdIf8ufFNJFCDIiPglEBjzZTbtp/w/DD3N89uuCH6ZU5wPFJ84vS2BADB1qHXg9Zq0BPiYfAMI29gEhD1r4OYE3p+JsO6nnBiKJpakxhkGkopoPPOfyDiLXj6M9+I/eL/Z25+I2AlsNV0Baxsvt0P5plpfg+m5zhlxPutT9xViRPYLZQEuZzwztcGjrAFgWRNyeOfxWPf06KiYZA0VqaPIxNPY5GpKBowft4O6dnX+hMsFVNbMfgC+5lIXzOkXvAKEML47yH2srUP2rLccPsWIUkslikjnm80kI+Tf0VRoaa4fJ6kgc0OLZ+H1d9C4vUOSPbNLqDabye4y6ZDo8rkiD6gNg0erATtqsHyg/hfiqcTErJ+Epjs1Ek+eI77Rq2Eg2ehRSWpVEqvJ7PqENR8D5KcJCsPJBEZV5ebsQuhaBlrH5p4HYa019H1v5EaifRqnwzTKaAQU1ZAnvzWPsrlggGPw6ljILH6/khq9cNtqsAXHSHIQc6hQJj4M7z6g1n1977yrV1IWPYVkCyiTnfDvaUVE+tpr/jcbaaffwIpEa8IrCEkHIbPlcIb3YJuDFIJOTHnAb0wquY/qxhAgJyAQI3ZGz0HjAzKHQ4jnoXf16L0bBtlXPYKC8K+8WWoXIQc0w9c1yHJBZ3nwcI9ZhRxpGLgSwi0/CTg37ScqI8GkRAc9G9NHJco8K5C+P5Uln4/4D3C88MnWyDO4swrTYPB7Y3ura2Rye16VjNAG2AhFWvBsDnWuBYk4fSdl2D7L6hTUAJJMf8ZCPz4KXjuXnIeadD6Y1hywGSEiUhefjwyumYEqov641Vh5pMQGiAqYvdJM7BjwLudFcjzHAWLw8x11nW+psG6H2D6UJCsqpczcUmZpkHAGIqXFQQwPW3K9m+DUWZru4bKgNmuEDr2vgaVC+U8PtB16DLfHBblQvIO3WOa81G1Dg672BXKv79GSjXzZSCUhi2Vn2/RcLfZYd0imPYmyo6qkUme9gqNBIZQNBLeXei5X707J8dehv6t4OolgOXAQ8hsvt2aRuA9xaTwo1AYOWtMhA3OX4Utx6FlyqymE0jYtj/SD6C8shNsyr37QnkXXwH+DP1IED6r7V1tNljyGXw2zmv7563412rgKldjmqPrULOh9YvyD4AWnSExHg7tKqtE6RYkl+/cP1d4cMIv2DcfhTolIV9OYQQdcvlD+QIw/GFoUAquJxG6/wx11eler4yyH5R7dlH5968QUdTOxMVi6VttvqnrMq9p8uu6+lyvhNC8GQDdAjTkwO+RHDtgzKu3LglqNZLuIwd+D+JqzFNIFsssZSQ5j1zg7g82ELjrBBQPgxKGoZjdoTtNVvFaPFy6Dr/+DUlONimfHrVRg4FFOPzz8XQ/jQFTVCMOiz/eZhc0dWRXXTFXCW85zb6AYFajafdTvb7GgKnp6lopBqI/zH0XViwQH1fiBZOUeB2lDJ6wYH+Zov1IJaUe9CxkBrXpl2NlwyevN1O2k5Rb20mJ/a4Y8Y4aDaH3WJVqr6XvcPyyCGYMQ4FEBfBi2amvMLhlQHPKVIH/+zxjn5ArBAa1hUN7DDG5Ecnpu47Mvt2uHC0HyCzdp2vKBTl8lNjhdElnjk3HpD5flWjrakPeQsq1jJH1n5gez/TVFnL4PFr7PtkvX4Kw/YHxBIfCnF8956/fagGSkoT7Ny0xLO6tyNCknQLV0EwZVYEgQFKwPwxoDN2iIDzMzR+3ipDb3f76STeu+TulJ8/15BviFz2BOaRk3H6pMAE/QsLgg+USENP1jB2A11rDkb1esfazgwFQFv1S/ANhyEyoUIv0DjSQjfCD8//I0OpZ5sjMY8BBpBhlHjJFu6Sysp9XehKAYuGyaaUt1B/aNGm/atPMJozuNEud7GilksoiuQ6dFJoHTdvBo89KxU5iBiV1YgL0eVhqLjLp52c3A6A2ZStQgBadofsI64BHam5QrtywZiFsWwUbzRZjB5VE+FZZ3EadUU3lUhZRxpjVJtMXlBVvUx7Objffo7Fi7CZI+RlUrw9V60mVrq4bCRkZY/Qty8XSd+ka6K3V9XA7M4BB3wOtKF4W+r4nIWI9E/6cn0NcyM3LYfk8OLbfyII1aIm6xSgPxa7gVytURr2+BkYTBpEoFQAx5CLvklY5LToJJp+USbvMZpOQrkT1jiOBnTO+Nm2zOhDbDUkKCaTfe1C7mXeGUGg2YYZrV2SE+g8fC7KWEA+xl/U0rnMKkp5+60kbQcFSHeUfCG17SCu2yMqy4U4veGJ2P8HzB5mdbxch2H6WOTTZQYcx2pt/ssVa+VmGrk6Tm58DPp8A/irTc/1iuHjmRlHtcsmwBWeSGAzGfcOA031wEG02yeGTNK54pFYhy2GM7KJqwC5sNqj/CLz+AVyN8eGVajdetnYLtC21+94mh7+kbs98C5KTQXL4+pENiXHZnYsTrHznnvg5dOq10Hj9A8P6/Y+RLuVa388SFSV5+7uAh5HcimwDMnMCFUYycrsA0KortO+dIppvdwoJl0LN+ZMMQ3UjkliyJrt/Wk5siLHKdNc6DYB77hePISnx9tp0Pz9pznB4j1GiDdJTsBseyrX+1xkABar8AJQG7FSoCX3GS6Nqh79v9XNm7QyXC+JjpS3L+sXuuEJ/BVrlrJ98G5yluUj2jETF6jaHjv0hT0TOUQ+aTaDDZV8Y3bjcpVlL0hr2eocBLFEQEgV7FckXkHa1EUWheQe5aZpY1M4sSC12BEhhzKal0n71xCH3wdqbkfDvDlLpyXOHAbyw/EhXsppIebm0is9bEAoUk4EWtZtKZm1kJQkmGWBTosVSRBOX0OX+5fMyaePQbum3f/wAnLxhXt4CpAPnUm7qw3eHAXxPBYEWSIi4CRKgSUGW8hcWxtBdEGWhosnuJ3P1/BwC1KSMWDFoJ9Jv/yhS47jvdl68/wIDuF+L++52QIJCg9VffyQoZIWuk5JjvwBJ//4WNWblDt2h/wz9P+lxC43mRqVyAAAAAElFTkSuQmCC";
  gl.bindTexture(gl.TEXTURE_2D,  this.Texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.TextureImage);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
  
  this.TextureImage.onload = handleTextureLoaded(this.TextureImage, this.Texture);
  this.TextureImage.src = "img/txtrs/txtr_default.png";
  }
  */
};



// Initialises the Mesh
vxMeshChunk.prototype.Init = function() {
  
  this.InitialiseBuffers();
  //this.IndexEnd = numOfFaces;
  this.IndexEnd = this.IndexStart + this.Indices.length/3;
  
  
  // Now Add it to the MeshCollection
  MeshCollection.push(this);
};

vxMeshChunk.prototype.InitialiseBuffers = function(){
  
  this.meshVerticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVerticesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh_vertices), gl.STATIC_DRAW);
  
    // Set up the normals for the vertices, so that we can compute lighting.
  this.meshVerticesNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVerticesNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vert_noramls), gl.STATIC_DRAW);
  
  /*
  // Set up the UV Texture Coordinates
  this.meshVerticesUVTexCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVerticesUVTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vert_uvcoords), gl.STATIC_DRAW);
  */
  
  // Now set up the colors
  this.meshVerticesColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVerticesColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vert_colours), gl.STATIC_DRAW);

  this.meshVerticesSelectionColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVerticesSelectionColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vert_selcolours), gl.STATIC_DRAW);


  // Now set up the colors
  this.meshVerticesWireframeColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVerticesWireframeColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.wire_colours), gl.STATIC_DRAW);

  // Build the element array buffer; this specifies the indices
  // into the vertex array for each face's vertices.
  this.meshVerticesIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.meshVerticesIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.Indices), gl.STATIC_DRAW);




// Edge Buffers
//*************************************************************************************
    this.edgeVerticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeVerticesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.edgevertices), gl.STATIC_DRAW);
  
    // Set up the normals for the vertices, so that we can compute lighting.
  this.edgeVerticesNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeVerticesNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.edge_noramls), gl.STATIC_DRAW);
  
  // Now set up the colors
  this.edgeVerticesColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeVerticesColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.edge_colours), gl.STATIC_DRAW);





  // Build the element array buffer; this specifies the indices
  // into the vertex array for each face's vertices.
  this.edgeVerticesIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.edgeVerticesIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.EdgeIndices), gl.STATIC_DRAW);
  
  
  
  this.initTextures();
};

vxMeshChunk.prototype.DrawSelPreProc = function(){

  if(this.Enabled === true){


  // Draw the mesh by binding the array buffer to the mesh's vertices
  // array, setting attributes, and pushing it to GL.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVerticesBuffer );
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    // Bind the normals buffer to the shader attribute.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVerticesNormalBuffer);
  gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
  
  /*
  // Bind Texture Coordinates
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVerticesUVTexCoordBuffer);
  gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
  
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, this.Texture);
  gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);
  */
  
  // Set the colors attribute for the vertices.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVerticesSelectionColorBuffer);
  gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
  
  // Draw the cube.
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.meshVerticesIndexBuffer);
  
  setMatrixUniforms();
    
    if(this.meshType == MeshType.Solid){
      gl.drawElements(gl.TRIANGLES, this.Indices.length, gl.UNSIGNED_SHORT, 0);
    }
  }

};


vxMeshChunk.prototype.Draw = function(){
  
  if(this.Enabled === true){

  // Draw the mesh by binding the array buffer to the mesh's vertices
  // array, setting attributes, and pushing it to GL.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVerticesBuffer );
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    // Bind the normals buffer to the shader attribute.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVerticesNormalBuffer);
  gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
  
  /*
  // Bind Texture Coordinates
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVerticesUVTexCoordBuffer);
  gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
  
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, this.Texture);
  gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);
  */

  
  // Set the colors attribute for the vertices.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVerticesColorBuffer);
  gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
  //console.log(this.Indices.length);
  // Draw the cube.
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.meshVerticesIndexBuffer);
  
  setMatrixUniforms();
  if(this.meshType == MeshType.Solid){
    gl.drawElements(gl.TRIANGLES, this.Indices.length, gl.UNSIGNED_SHORT, 0);
  }
  if(this.meshType == MeshType.Lines){
    gl.drawElements(gl.LINES, this.Indices.length, gl.UNSIGNED_SHORT, 0);
  }
  }
};

// Draws the Edge Mesh with using the Mesh Colours
vxMeshChunk.prototype.DrawWireframe = function(){
  
  if(this.Enabled === true){

  if(this.meshType == MeshType.Solid){
  // Draw the mesh by binding the array buffer to the mesh's vertices
  // array, setting attributes, and pushing it to GL.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeVerticesBuffer );
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    // Bind the normals buffer to the shader attribute.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeVerticesNormalBuffer);
  gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
  
  /*
    // Bind Texture Coordinates
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVerticesUVTexCoordBuffer);
  gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
  
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, this.Texture);
  gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);
  */
  
  // Set the colors attribute for the vertices.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVerticesWireframeColorBuffer);
  gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
  
  // Draw the cube.
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.edgeVerticesIndexBuffer);
  
  setMatrixUniforms();

  gl.drawElements(gl.LINES, this.EdgeIndices.length, gl.UNSIGNED_SHORT, 0);

  }
  }
};


vxMeshChunk.prototype.DrawEdge = function(){
  
  if(this.Enabled === true){

  if(this.meshType == MeshType.Solid){
  // Draw the mesh by binding the array buffer to the mesh's vertices
  // array, setting attributes, and pushing it to GL.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeVerticesBuffer );
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    // Bind the normals buffer to the shader attribute.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeVerticesNormalBuffer);
  gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
  
  // Set the colors attribute for the vertices.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeVerticesColorBuffer);
  gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
  
  // Draw the cube.
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.edgeVerticesIndexBuffer);
  
  setMatrixUniforms();

  gl.drawElements(gl.LINES, this.EdgeIndices.length, gl.UNSIGNED_SHORT, 0);

  }
}
};

vxMeshChunk.prototype.AddVertices = function(vertices, normal, colour, encodedIndexColor){
 
         this.mesh_vertices.push(vertices.X);
         this.mesh_vertices.push(vertices.Y);
         this.mesh_vertices.push(vertices.Z);
  
         this.vert_noramls.push(normal.X);
         this.vert_noramls.push(normal.Y);
         this.vert_noramls.push(normal.Z);
         
         
         //this.vert_uvcoords.push(normal.X);
         //this.vert_uvcoords.push(normal.Y);
         
         this.vert_colours.push(colour.R);
         this.vert_colours.push(colour.G);
         this.vert_colours.push(colour.B);
         this.vert_colours.push(colour.A);

         //Set Selection Colour
         this.vert_selcolours.push(encodedIndexColor.R);
         this.vert_selcolours.push(encodedIndexColor.G);
         this.vert_selcolours.push(encodedIndexColor.B);
         this.vert_selcolours.push(encodedIndexColor.A);

         //Increment Indicies
         this.Indices.push(this.Indices.length);
         
         // Now Check if it's outside the current bounds
         if(vertices.Length() > this.MaxPoint.Length())
         {
           this.MaxPoint.Set(vertices.X, vertices.Y, vertices.Z);
         }
};

vxMeshChunk.prototype.AddFace = function(vert1, vert2, vert3, normal, colour, encodedIndexColor){
    
  this.AddVertices(vert1, normal, colour, encodedIndexColor);
  this.AddVertices(vert2, normal, colour, encodedIndexColor);
  this.AddVertices(vert3, normal, colour, encodedIndexColor);

  this.AddEdge(vert1, vert2);
  this.AddEdge(vert2, vert3);
  this.AddEdge(vert3, vert1);
};

vxMeshChunk.prototype.AddEdge = function(vert1, vert2){

  this.edgevertices.push(vert1.X);
  this.edgevertices.push(vert1.Y);
  this.edgevertices.push(vert1.Z);

  this.edgevertices.push(vert2.X);
  this.edgevertices.push(vert2.Y);
  this.edgevertices.push(vert2.Z);

  this.edge_noramls.push(1);
  this.edge_noramls.push(0);
  this.edge_noramls.push(0);
  this.edge_noramls.push(1);
  this.edge_noramls.push(0);
  this.edge_noramls.push(0);

  this.edge_colours.push(0);
  this.edge_colours.push(0);
  this.edge_colours.push(0);
  this.edge_colours.push(1);
  this.edge_colours.push(0);
  this.edge_colours.push(0);
  this.edge_colours.push(0);
  this.edge_colours.push(1);


  this.wire_colours.push(this.meshcolor.R);
  this.wire_colours.push(this.meshcolor.G);
  this.wire_colours.push(this.meshcolor.B);
  this.wire_colours.push(1);
  this.wire_colours.push(this.meshcolor.R);
  this.wire_colours.push(this.meshcolor.G);
  this.wire_colours.push(this.meshcolor.B);
  this.wire_colours.push(1);


  this.EdgeIndices.push(this.EdgeIndices.length);
  this.EdgeIndices.push(this.EdgeIndices.length);

  };
  
  vxMeshChunk.prototype.IsPastIndiceLimit = function()
  {
    if(this.EdgeIndices > 65000 || this.Indices > 65000)
    {
      return true;
    }
    else
    {
      return false;
    }
  };
