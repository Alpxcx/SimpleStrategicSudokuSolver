function bitArray(length,initvalue){
	this.ol = length;
	this.can = length;
	this.v = 0;
	this.isfilled=false;
	this.invalid=false;
	this.v=initvalue;
	this.del = function(inputnum){
		if(inputnum==-1) return false;
		var bit = 1;
		bit = bit << inputnum;
		var bool = (this.v&bit);
		if(bool){
			this.v = this.v&(~bit);
			this.can--;
			if(this.v==0) this.invalid=true;
		}
		return bool;
	}

	this.clr = function(){
		this.can=0;
		this.v=0;
		this.isfilled=true;
	}
	this.fill = function(inputnum){
		this.can=1;
		this.v=1 << inputnum;
		this.isfilled=true;
	}
	this.cpy = function(){
		var res =  new bitArray(this.ol,this.v);
		res.can = this.can;
		res.isfilled = this.isfilled;
		res.invalid = this.invalid;
		return res;
	}
}

function bitGroup(length,initvalue,init){
	this.unfc = length;
	this.v=initvalue;
	this.dot=0;
	this.mem = new Array(length);
	this.isfilled=false;
	this.invalid=false;
	this.hdexist=false;
	this.hp1=0;
	this.hp2=0;
	this.numx=0;
	if(init===undefined){
		for(var i=0,bit=1;i < length;i++){
			this.mem[i] = new bitArray(length,initvalue);
		}
	}
  this.fill = function(num,pos){
  	for(var i=0;i < this.mem.length;i++){
  		if(i==num) continue;
  		this.dcan(i,pos);
  	}
  	if(this.mem[num].can==2||this.mem[num].can==3) this.dot--;
  	this.mem[num].fill(pos);
  	this.unfc--;
  	this.v = this.v&~(1 << num);
  	if(this.v==0) this.isfilled=true;
  }
  this.dcan = function(can,pos){
  	var res = false;
  	if(this.mem[can].del(pos)){
  	  if(this.mem[can].invalid) this.invalid=true;
  		if(this.mem[can].can==1){
  			this.dot--;
  		  this.hspos = bittonum(this.mem[can].v,this.mem.length);
  		  res = true;
  		}else if(this.mem[can].can==3){
  			this.dot++;
  		}
  	}
  	return res;
  }
  this.fhd = function(num){
  	this.hdexist=false;
  	if(this.mem[num].can==2){
  		var matched=false;
  		for(var i=0;i < this.mem.length;i++){
  			if(this.mem[i].v==this.mem[num].v&&i!=num){
  				matched=true;
  				this.numx=i;
  				break;
  			}
  		}
  		if(!matched) return false;
  		this.hdexist=true;
  		this.hp1=bittonum(this.mem[i].v,9);
  		this.hp2=bittonum(this.mem[i].v&~(1 << this.hp1),9);
  		return true;
  	}
  }
  this.cpy = function(){
  	var ol = this.mem.length;
  	var res = new bitGroup(ol,this.v,0);
  	res.unfc = this.unfc;
  	for(var i=0;i < ol;i++){
  		res.mem[i] = this.mem[i].cpy();
  	}
  	res.isfilled = this.isfilled;
  	res.invalid = this.invalid;
  	return res;
  }
}

function sd9(consoleSwitch=true,ogn=true,level=15){
	{
	this.arr = new Array(81);
	this.cells = new Array(81);
	this.ncache = new Array(729);
	this.tcache = new Array(729);
	this.d_or_t = new Array(27);
  this.tstat = 0;
  this.rnst = new Array(9);
  this.cnst = new Array(9);
  this.bnst = new Array(9);
	if(ogn){
  	for(var i=0,bit=1,tbit=0;i < 9;i++){
  	  tbit += bit;
  	  bit = bit << 1;
    }
		this.arr.fill(0);
		//Recording candidates for each cell
		autofill(this.cells,bitArray,9,tbit);
		this.ncache.fill(true);
		this.tcache.fill(false);
		this.d_or_t.fill(0);
    autofill(this.rnst,bitGroup,9,tbit);
    autofill(this.cnst,bitGroup,9,tbit);
    autofill(this.bnst,bitGroup,9,tbit);
	}
	this.nslist = new Array;
	this.hslist = new Array;
	this.ndlist = new Array;
	this.hdlist = new Array;
	this.claims = new Array;
	this.xwlist = new Array;
	this.ywlist = new Array;
	this.xyzlst = new Array;
	this.ntlist = new Array;
	this.htlist = new Array;
	this.htlist = new Array;
	this.sflist = new Array;
	this.depth = 0;
	this.dfscnt = 0
	this.triable = true;
	this.ndcr=false;
	this.ndcc=false;
	this.ndcb=false;
	this.isvalid=true;
	this.issolved=false;
	this.slvl=level;
	this.con=consoleSwitch;
	this.logs = new Array;
	this.bpstn = [0,0,0,1,1,1,2,2,2,
	              0,0,0,1,1,1,2,2,2,
	              0,0,0,1,1,1,2,2,2,
	              3,3,3,4,4,4,5,5,5,
	              3,3,3,4,4,4,5,5,5,
	              3,3,3,4,4,4,5,5,5,
	              6,6,6,7,7,7,8,8,8,
	              6,6,6,7,7,7,8,8,8,
	              6,6,6,7,7,7,8,8,8];
	this.bpjtn = [[0,1,2,9,10,11,18,19,20],
	              [3,4,5,12,13,14,21,22,23],
	              [6,7,8,15,16,17,24,25,26],
	              [27,28,29,36,37,38,45,46,47],
	              [30,31,32,39,40,41,48,49,50],
	              [33,34,35,42,43,44,51,52,53],
	              [54,55,56,63,64,65,72,73,74],
	              [57,58,59,66,67,68,75,76,77],
	              [60,61,62,69,70,71,78,79,80]];
	this.bcnpj = [0,1,2,0,1,2,0,1,2,
	              3,4,5,3,4,5,3,4,5,
	              6,7,8,6,7,8,6,7,8,
	              0,1,2,0,1,2,0,1,2,
	              3,4,5,3,4,5,3,4,5,
	              6,7,8,6,7,8,6,7,8,
	              0,1,2,0,1,2,0,1,2,
	              3,4,5,3,4,5,3,4,5,
	              6,7,8,6,7,8,6,7,8];
  }
  
  this.init = function(arr){
  	for(var i=0;i < 81;i++){
  		this.place(arr[i]-1,i);
  	}
  }
  
  this.place = function(num,pos){
  	if(this.cells[pos].isfilled) return false;
  	var res = (this.cells[pos].v&(1 << num))&&this.isvalid;
  	if(res){
  		this.cells[pos].del(num);
  		var r = Math.floor(pos/9);
    	var c = pos%9;
    	var b = this.bpstn[pos];
  		this.arr[pos]=num+1;
  		this.cells[pos].isfilled=true;
    	this.dall(pos);
    	this.tstat++;
    	this.rnst[r].fill(num,c);
    	this.cnst[c].fill(num,r);
    	this.bnst[b].fill(num,this.bcnpj[pos]);
    	this.drcb(r,c,b,num);
    	this.cells[pos].fill(num);
    	if(this.tstat==81) this.issolved=true;
  	}else{
  		if(this.cells[pos].can==0) this.isvalid=false;
  	}
  	return res;
  }
  
  this.dall = function(pos){
  	for(var i=0;i < 9;i++){
  		if(this.cells[pos].v&(1 << i)){
  			this.delcan(i,pos);
  		}
  	}
  }
  
  this.drcb = function(r,c,b,n){
  	r=r*9;
  	for(var i=0;i < 9;i++){
  		this.delcan(n,r);
  		this.delcan(n,c);
  		this.delcan(n,this.bpjtn[b][i]);
  		r++;
  		c+=9;
  	}
  }
  
  this.delcan = function(num,pos){
  	var res = this.cells[pos].del(num)&&this.isvalid;
  	if(res){
    	var r = Math.floor(pos/9);
    	var c = pos%9;
    	var b = this.bpstn[pos];
    	var bn = this.bcnpj[pos];
    	this.ncache[pos*9+num] = false;
  		if (this.rnst[r].dcan(num,c)) this.hslist.push([num,this.rnst[r].hspos+9*r,"row"]);
  		if (this.cnst[c].dcan(num,r)) this.hslist.push([num,this.cnst[c].hspos*9+c,"column"]);
  		if(this.bnst[b].dcan(num,bn)) this.hslist.push([num,this.bpjtn[b][this.bnst[b].hspos],"block"]);
  		switch(this.cells[pos].can){
  			case 3:
  	  	this.d_or_t[r]++;
  	  	this.d_or_t[c+9]++;
  	  	this.d_or_t[b+18]++;
  	  	break;
  	  	case 1:
  	  	this.d_or_t[r]--;
  	  	this.d_or_t[c+9]--;
  	  	this.d_or_t[b+18]--;
  	  	break;
  		}
  		if(this.rnst[r].invalid||this.cnst[c].invalid||this.bnst[b].invalid){
  			this.isvalid=false;
  			return;
  		}
  		if(this.cells[pos].can==1&&!this.cells[pos].isfilled){
  			this.nslist.push([bittonum(this.cells[pos].v,9),pos]);
  		}
  		//Find hidden double
			this.findHD(r,c,b,num);
  		//Find naked double
			this.findND(r,c,b);
			//Find locked candidates
			this.BLRD(r,c,b,num);
			this.findXW(r,c,num);
			this.findSSF(r,c,num);
			this.findSF(r,c,num);
			this.findSNT(r,c,b);
			this.findNT(r,c,b);
			this.findHT(r,c,b,num);
			this.findYW(r,c,b);
  	}
  	return res;
  }
  
  this.findHD = function(r,c,b,num){
  	if(this.rnst[r].unfc > 4&&this.rnst[r].fhd(num)){
			var rp1 = r*9+this.rnst[r].hp1;
			var rp2 = r*9+this.rnst[r].hp2;
			this.hdlist.push([num,this.rnst[r].numx,rp1,rp2]);
		}
		if(this.cnst[c].unfc > 4&&this.cnst[c].fhd(num)){
			var cp1 = c+9*this.cnst[c].hp1;
			var cp2 = c+9*this.cnst[c].hp2;
			this.hdlist.push([num,this.cnst[c].numx,cp1,cp2]);
		}
		if(this.bnst[b].unfc > 4&&this.bnst[b].fhd(num)){
			var bp1 = this.bpjtn[b][this.bnst[b].hp1];
			var bp2 = this.bpjtn[b][this.bnst[b].hp2];
			this.hdlist.push([num,this.bnst[b].numx,bp1,bp2]);
		}
  }
  
  this.findND = function(r,c,b){
  	var posx,hn1,hn2;
  	var rs=r*9;
  	var p=rs+c;
  	if(this.cells[p].isfilled) return;
  	this.ndcr=false;
  	this.ndcc=false;
  	this.ndcb=false;
  	if(this.cells[p].can==2){
  		if(this.rnst[r].unfc > 3){
  			for(var i=0,matchcount=0;i < 9;i++){
    			if(this.cells[rs].v==this.cells[p].v&&rs!=p){
    				matchcount++;
    				posx=rs;
    				break;
    			}
    			rs++;
    		}
    		if(matchcount==1){
    			this.ndcr=true;
    		  hn1=bittonum(this.cells[p].v,9);
    		  hn2=bittonum(this.cells[p].v&~(1 << hn1),9);
    		  this.ndlist.push([hn1,hn2,p,posx,1]);
    		}
  		}
  		if(this.cnst[c].unfc > 3){
  			for(var i=0,cs=c,matchcount=0;i < 9;i++){
    			if(this.cells[cs].v==this.cells[p].v&&cs!=p){
    				matchcount++;
    				posx=cs;
    				break;
    			}
    			cs+=9;
    		}
    		if(matchcount==1){
    			this.ndcc=true;
    		  hn1=bittonum(this.cells[p].v,9);
    		  hn2=bittonum(this.cells[p].v&~(1 << hn1),9);
    		  this.ndlist.push([hn1,hn2,p,posx,2]);
    		}
  		}
  		if(this.bnst[b].unfc > 3){
  			for(var i=0,matchcount=0;i < 9;i++){
    			if(this.cells[this.bpjtn[b][i]].v==this.cells[p].v&&this.bpjtn[b][i]!=p){
    				matchcount++;
    				posx=this.bpjtn[b][i];
    				break;
    			}
    		}
    		if(matchcount==1){
    			this.ndcb=true;
    		  hn1=bittonum(this.cells[p].v,9);
    		  hn2=bittonum(this.cells[p].v&~(1 << hn1),9);
    		  this.ndlist.push([hn1,hn2,p,posx,4]);
    		}
  		}
  	}
  }
  
  this.BLRD = function(r,c,b,num){
  	if(this.cells[r*9+c].can==1) return;
  	var rst=this.rnst[r].mem[num];
  	var cst=this.cnst[c].mem[num];
  	var bst=this.bnst[b].mem[num];
  	if(rst.can==3||rst.can==2){
  		switch(0){
  			case rst.v&0770:
  			var tb = this.bpstn[r*9];
  			if(rst.can == this.bnst[tb].mem[num].can) break;
  			this.claims.push([num,tb,(7 << 3*(r%3)),4,r]);
  			break;
  			case rst.v&0707:
  			var tb = this.bpstn[r*9]+1;
  			if(rst.can == this.bnst[tb].mem[num].can) break;
  			this.claims.push([num,tb,(7 << 3*(r%3)),4,r]);
  			break;
  			case rst.v&0077:
  			var tb = this.bpstn[r*9]+2;
  			if(rst.can == this.bnst[tb].mem[num].can) break;
  			this.claims.push([num,tb,(7 << 3*(r%3)),4,r]);
  			break;
  		}
  	}
  	if(cst.can==3||cst.can==2){
  		switch(0){
  			case cst.v&0770:
  			var tb = this.bpstn[c];
  		  if(cst.can == this.bnst[tb].mem[num].can) break;
  			this.claims.push([num,tb,(0111 << (c%3)),4,c])
  			break;
  			case cst.v&0707:
  			var tb = this.bpstn[c]+3;
  		  if(cst.can == this.bnst[tb].mem[num].can) break;
  			this.claims.push([num,tb,(0111 << (c%3)),4,c])
  			break;
  			case cst.v&0077:
  			var tb = this.bpstn[c]+6;
  		  if(cst.can == this.bnst[tb].mem[num].can) break;
  			this.claims.push([num,tb,(0111 << (c%3)),4,c])
  			break;
  		}
  	}
  	if(bst.can==3||bst.can==2){
  		switch(0){
  			case bst.v&0770:
  			var tr = b-b%3;
  		  if(bst.can == this.rnst[tr].mem[num].can) break;
  			this.claims.push([num,tr,(7 << 3*(b%3)),1]);
  			break;
  			case bst.v&0707:
  			var tr = b-b%3+1;
  		  if(bst.can == this.rnst[tr].mem[num].can) break;
  			this.claims.push([num,tr,(7 << 3*(b%3)),1,b]);
  			break;
  			case bst.v&0077:
  			var tr = b-b%3+2;
  		  if(bst.can == this.rnst[tr].mem[num].can) break;
  			this.claims.push([num,tr,(7 << 3*(b%3)),1],b);
  			break;
  			case bst.v&0666:
  			var tc = 3*(b%3);
  		  if(bst.can == this.cnst[tc].mem[num].can) break;
  			this.claims.push([num,tc,(7 << (b-b%3)),2],b);
  			break;
  			case bst.v&0555:
  			var tc = 3*(b%3)+1;
  		  if(bst.can == this.cnst[tc].mem[num].can) break;
  			this.claims.push([num,tc,(7 << (b-b%3)),2],b);
  			break;
  			case bst.v&0333:
  			var tc = 3*(b%3)+2;
  		  if(bst.can == this.cnst[tc].mem[num].can) break;
  			this.claims.push([num,tc,(7 << (b-b%3)),2],b);
  			break;
  		}
  	}
  }
  
  this.findXW = function(r,c,num){
  	var matched = false;
  	var res = false;
  	var xp1,xp2;
  	if(this.rnst[r].mem[num].can==2){
  		for(var i=0;i < 9;i++){
  			if(this.rnst[r].mem[num].v==this.rnst[i].mem[num].v&&i!=r){
  				matched = true;
  				res = true;
  				break;
  			}
  		}
  		if(matched){
  			xp1 = bittonum(this.rnst[r].mem[num].v,9);
  			xp2 = bittonum(this.rnst[r].mem[num].v&~(1 << xp1),9);
  			if(r-r%3-i+i%3==0&&xp1-xp1%3-xp2+xp2%3==0) return;
  			this.xwlist.push([num,r,i,xp1,xp2,1]);
  		}
  	}
  	if(this.cnst[c].mem[num].can==2){
  		matched = false;
  		for(var i=0;i < 9;i++){
  			if(this.cnst[c].mem[num].v==this.cnst[i].mem[num].v&&i!=c){
  				matched = true;
  				res = true;
  				break;
  			}
  		}
  		if(matched){
  			xp1 = bittonum(this.cnst[c].mem[num].v,9);
  			xp2 = bittonum(this.cnst[c].mem[num].v&~(1 << xp1),9);
  			if(c-c%3-i+i%3==0&&xp1-xp1%3-xp2+xp2%3==0) return;
  			this.xwlist.push([num,c,i,xp1,xp2,2]);
  		}
  	}
  	return res;
  }
  
  this.findSNT = function(r,c,b){
  	var posx,posy,hn1,hn2,hn3;
  	var rs=r*9;
  	var p=rs+c;
  	if(this.cells[p].isfilled) return;
  	var tbit=~this.cells[p].v;
  	if(this.cells[p].can==3){
  		if(this.rnst[r].unfc > 5&&this.d_or_t[r] > 2){
    		for(var i=0,matchcount=0;i < 8;i++,rs++){
    			if(this.cells[rs].isfilled||(tbit&this.cells[rs].v)) continue;
    			if(rs!=p){
    				matchcount++;
    				posx=rs;
    				for(i++,rs++;i < 9;i++,rs++){
    			    if(this.cells[rs].isfilled||(tbit&this.cells[rs].v)) continue;
    					if(rs!=p){
    						matchcount++;
    						posy=rs;
    					}
    				}
    			}
    		}
    		if(matchcount==2){
    		  hn1=bittonum(this.cells[p].v,9);
    		  var tbitx = this.cells[p].v&~(1 << hn1);
    		  hn2=bittonum(tbitx,9);
    		  hn3=bittonum(tbitx&~(1 << hn2),9);
    		  this.ntlist.push([hn1,hn2,hn3,p,posx,posy,1]);
    		}
  		}
  		if(this.cnst[c].unfc > 5&&this.d_or_t[c+9] > 2){
  			var cs=c;
    		for(var i=0,matchcount=0;i < 8;i++,cs+=9){
    			if(this.cells[cs].isfilled||(tbit&this.cells[cs].v)) continue;
    			if(cs!=p){
    				matchcount++;
    				posx=cs;
    				for(i++,cs+=9;i < 9;i++,cs+=9){
    			    if(this.cells[cs].isfilled||(tbit&this.cells[cs].v)) continue;
    					if(cs!=p){
    						matchcount++;
    						posy=cs;
    					}
    				}
    			}
    		}
    		if(matchcount==2){
    		  hn1=bittonum(this.cells[p].v,9);
    		  var tbitx = this.cells[p].v&~(1 << hn1);
    		  hn2=bittonum(tbitx,9);
    		  hn3=bittonum(tbitx&~(1 << hn2),9);
    		  this.ntlist.push([hn1,hn2,hn3,p,posx,posy,2]);
    		}
  		}
  		if(this.bnst[b].unfc > 5&&this.d_or_t[b+18] > 2){
    		for(var i=0,matchcount=0;i < 8;i++){
    			if(this.cells[this.bpjtn[b][i]].isfilled||(tbit&this.cells[this.bpjtn[b][i]].v)) continue;
    			if(this.bpjtn[b][i]!=p){
    				matchcount++;
    				posx=this.bpjtn[b][i];
    				for(i++;i < 9;i++){
    			    if(this.cells[this.bpjtn[b][i]].isfilled||(tbit&this.cells[this.bpjtn[b][i]].v)) continue;
    					if(this.bpjtn[b][i]!=p){
    						matchcount++;
    						posy=this.bpjtn[b][i];
    					}
    				}
    			}
    		}
    		if(matchcount==2){
    		  hn1=bittonum(this.cells[p].v,9);
    		  var tbitx = this.cells[p].v&~(1 << hn1);
    		  hn2=bittonum(tbitx,9);
    		  hn3=bittonum(tbitx&~(1 << hn2),9);
    		  this.ntlist.push([hn1,hn2,hn3,p,posx,posy,4]);
    		}
  		}
  	}
  }
  
  this.findNT = function(r,c,b){
  	var hn1,hn2,hn3,c1,c2,c3,tbit;
  	var rs=r*9;
  	var p=rs+c;
  	if(!this.cells[p]) this.logs.push("p"+p);
  	if(this.cells[p].isfilled) return;
  	var foundmatch;
  	if(this.cells[p].can==2){
  		if(this.rnst[r].unfc > 5&&this.d_or_t[r] > 2&&!this.ndcr){
  			foundmatch=false;
  			rofor:
  			for(var i=0,ix,iy;i < 7;i++){
  				if(this.cells[rs+i].can ==1) continue;
  				if(this.cells[rs+i].can > 3) continue;
  				for(ix=i+1;ix < 8;ix++){
  					if(this.cells[rs+ix].can ==1) continue;
  					if(this.cells[rs+ix].can > 3) continue;
  					for(iy=ix+1;iy < 9;iy++){
  						if(this.cells[rs+iy].can == 1) continue;
  						foundmatch=checktpl(this.cells[rs+i].v,this.cells[rs+ix].v,this.cells[rs+iy].v);
  						if(foundmatch) break rofor;
  					}
  				}
  			}
  			if(foundmatch){
  				tbit=this.cells[rs+i].v|this.cells[rs+ix].v;
  				c1=bittonum(tbit,9);
  				c2=c1+1+bittonum(tbit >> (c1+1),8-c1);
  				c3=c2+1+bittonum(tbit >> (c2+1),8-c2);
  				this.ntlist.push([c1,c2,c3,rs+i,rs+ix,rs+iy,1]);
  			}
  		}
  		if(this.cnst[c].unfc > 5&&this.d_or_t[c+9] > 2&&!this.ndcc){
  			foundmatch=false;
  			var cs = c;
  		  cofor:
  			for(var i=0,ix,iy;i < 7;i++,cs+=9){
  				if(this.cells[cs].can ==1) continue;
  				if(this.cells[cs].can > 3) continue;
  				for(ix=i+1,csx=cs+9;ix < 8;ix++,csx+=9){
  					if(this.cells[csx].can ==1) continue;
  					if(this.cells[csx].can > 3) continue;
  					for(iy=ix+1,csy=csx+9;iy < 9;iy++,csy+=9){
  						if(this.cells[csy].can == 1) continue;
  						foundmatch=checktpl(this.cells[cs].v,this.cells[csx].v,this.cells[csy].v);
  						if(foundmatch) break cofor;
  					}
  				}
  			}
  			if(foundmatch){
  				tbit=this.cells[cs].v|this.cells[csx].v;
  				c1=bittonum(tbit,9);
  				c2=c1+1+bittonum(tbit >> (c1+1),8-c1);
  				c3=c2+1+bittonum(tbit >> (c2+1),8-c2);
  				this.ntlist.push([c1,c2,c3,cs,csx,csy,2]);
  			}
  		}
  		if(this.bnst[b].unfc > 5&&this.d_or_t[b+18] > 2&&!this.ndcb){
  			foundmatch=false;
  			bofor:
  			for(var i=0,ix,iy;i < 7;i++){
  				if(this.cells[this.bpjtn[b][i]].can ==1) continue;
  				if(this.cells[this.bpjtn[b][i]].can > 3) continue;
  				for(ix=i+1;ix < 8;ix++){
  					if(this.cells[this.bpjtn[b][ix]].can ==1) continue;
  					if(this.cells[this.bpjtn[b][ix]].can > 3) continue;
  					for(iy=ix+1;iy < 9;iy++){
  						if(this.cells[this.bpjtn[b][iy]].can == 1) continue;
  						foundmatch=checktpl(this.cells[this.bpjtn[b][i]].v,this.cells[this.bpjtn[b][ix]].v,this.cells[this.bpjtn[b][iy]].v);
  						if(foundmatch) break bofor;
  					}
  				}
  			}
  			if(foundmatch){
  				tbit=this.cells[this.bpjtn[b][i]].v|this.cells[this.bpjtn[b][ix]].v;
  				c1=bittonum(tbit,9);
  				c2=c1+1+bittonum(tbit >> (c1+1),8-c1);
  				c3=c2+1+bittonum(tbit >> (c2+1),8-c2);
  				this.ntlist.push([c1,c2,c3,this.bpjtn[b][i],this.bpjtn[b][ix],this.bpjtn[b][iy],4]);
  			}
  		}
  	}
  }
  
  this.findHT = function(r,c,b,num){
  	if(!this.rnst[r].mem[num].isfilled&&this.rnst[r].unfc > 6&&!this.rnst[r].hdexist&&this.rnst[r].dot > 2){
  		var matchcount=0;
  		var matchlist = new Array(2);
  		if(this.rnst[r].mem[num].can==3){
  			for(var i=0;i < 9;i++){
  				if(i==num) continue;
  				if(this.rnst[r].mem[i].can < 2) continue;
  				if((this.rnst[r].mem[i].v|this.rnst[r].mem[num].v)==this.rnst[r].mem[num].v){
  					matchlist[matchcount]=i;
  					matchcount++;
  				}
  			}
  			if(matchcount==2&&(this.rnst[r].mem[num].v==(this.rnst[r].mem[matchlist[0]].v|this.rnst[r].mem[matchlist[1]].v))){
  				var rs = r*9;
  				var rp1 = bittonum(this.rnst[r].mem[num].v,9);
  				var rp2 = rp1+1+bittonum(this.rnst[r].mem[num].v >> (rp1+1),8-rp1);
  				var rp3 = rp2+1+bittonum(this.rnst[r].mem[num].v >> (rp2+1),8-rp2);
  				this.htlist.push([num,matchlist[0],matchlist[1],rs+rp1,rs+rp2,rs+rp3]);
  			}
  		}else if(this.rnst[r].mem[num].can==2){
  			for(var i=0;i < 9;i++){
  				if(i==num) continue;
  				if(this.rnst[r].mem[i].can==3&&((this.rnst[r].mem[i].v|this.rnst[r].mem[num].v)==this.rnst[r].mem[i].v)){
  					matchlist[matchcount]=i;
  					matchcount++;
  				}else if(this.rnst[r].mem[i].can==2&&countcan(this.rnst[r].mem[i].v|this.rnst[r].mem[num].v,9)==3){
  					matchlist[matchcount]=i;
  					matchcount++;
  				}
  			}
  			if(matchcount==2){
  				var tbit = this.rnst[r].mem[num].v|this.rnst[r].mem[matchlist[0]].v;
  				if(tbit==(tbit|this.rnst[r].mem[matchlist[1]].v)){
  					var rs = r*9;
    				var rp1 = bittonum(tbit,9);
    				var rp2 = rp1+1+bittonum(tbit >> (rp1+1),8-rp1);
    				var rp3 = rp2+1+bittonum(tbit >> (rp2+1),8-rp2);
    				this.htlist.push([num,matchlist[0],matchlist[1],rs+rp1,rs+rp2,rs+rp3]);
  				}
  			}
  		}
  	}
  	if(!this.cnst[c].mem[num].isfilled&&this.cnst[c].unfc > 6&&!this.cnst[c].hdexist&&this.cnst[c].dot > 2){
  		var matchcount=0;
  		var matchlist = new Array(2);
  		if(this.cnst[c].mem[num].can==3){
    		for(var i=0;i < 9;i++){
  				if(i==num) continue;
  				if(this.cnst[c].mem[i].can < 2) continue;
  				if((this.cnst[c].mem[i].v|this.cnst[c].mem[num].v)==this.cnst[c].mem[num].v){
  					matchlist[matchcount]=i;
  					matchcount++;
  				}
  			}
  			if(matchcount==2&&(this.cnst[c].mem[num].v==(this.cnst[c].mem[matchlist[0]].v|this.cnst[c].mem[matchlist[1]].v))){
  				var cp1 = bittonum(this.cnst[c].mem[num].v,9);
  				var cp2 = cp1+1+bittonum(this.cnst[c].mem[num].v >> (cp1+1),8-cp1);
  				var cp3 = cp2+1+bittonum(this.cnst[c].mem[num].v >> (cp2+1),8-cp2);
  				this.htlist.push([num,matchlist[0],matchlist[1],c+9*cp1,c+9*cp2,c+9*cp3]);
  			}
  		}else if(this.cnst[c].mem[num].can==2){
  			for(var i=0;i < 9;i++){
  				if(i==num) continue;
  				if(this.cnst[c].mem[i].can==3&&((this.cnst[c].mem[i].v|this.cnst[c].mem[num].v)==this.cnst[c].mem[i].v)){
  					matchlist[matchcount]=i;
  					matchcount++;
  				}else if(this.cnst[c].mem[i].can==2&&countcan(this.cnst[c].mem[i].v|this.cnst[c].mem[num].v,9)==3){
  					matchlist[matchcount]=i;
  					matchcount++;
  				}
  			}
  			if(matchcount==2){
  				var tbit = this.cnst[c].mem[num].v|this.cnst[c].mem[matchlist[0]].v;
  				if(tbit==(tbit|this.cnst[c].mem[matchlist[1]].v)){
  					var cp1 = bittonum(tbit,9);
    				var cp2 = cp1+1+bittonum(tbit >> (cp1+1),8-cp1);
    				var cp3 = cp2+1+bittonum(tbit >> (cp2+1),8-cp2);
    				this.htlist.push([num,matchlist[0],matchlist[1],c+9*cp1,c+9*cp2,c+9*cp3]);
  				}
  			}
  		}
  	}
  	if(!this.bnst[b].mem[num].isfilled&&this.bnst[b].unfc > 6&&!this.bnst[b].hdexist&&this.bnst[b].dot > 2){
  		var matchcount=0;
  		var matchlist = new Array(2);
  		if(this.bnst[b].mem[num].can==3){
    		for(var i=0;i < 9;i++){
  				if(i==num) continue;
  				if(this.bnst[b].mem[i].can < 2) continue;
  				if((this.bnst[b].mem[i].v|this.bnst[b].mem[num].v)==this.bnst[b].mem[num].v){
  					matchlist[matchcount]=i;
  					matchcount++;
  				}
  			}
  			if(matchcount==2&&(this.bnst[b].mem[num].v==(this.bnst[b].mem[matchlist[0]].v|this.bnst[b].mem[matchlist[1]].v))){
  				var tbit = this.bnst[b].mem[num].v|this.bnst[b].mem[matchlist[0]].v;
  				var bp1 = bittonum(tbit,9);
  				var bp2 = bp1+1+bittonum(tbit >> (bp1+1),8-bp1);
  				var bp3 = bp2+1+bittonum(tbit >> (bp2+1),8-bp2);
  				this.htlist.push([num,matchlist[0],matchlist[1],this.bpjtn[b][bp1],this.bpjtn[b][bp2],this.bpjtn[b][bp3]]);
  			}
  		}else if(this.bnst[b].mem[num].can==2){
  			for(var i=0;i < 9;i++){
  				if(i==num) continue;
  				if(this.bnst[b].mem[i].can==3&&((this.bnst[b].mem[i].v|this.bnst[b].mem[num].v)==this.bnst[b].mem[i].v)){
  					matchlist[matchcount]=i;
  					matchcount++;
  				}else if(this.bnst[b].mem[i].can==2&&countcan(this.bnst[b].mem[i].v|this.bnst[b].mem[num].v,9)==3){
  					matchlist[matchcount]=i;
  					matchcount++;
  				}
  			}
  			if(matchcount==2){
  				var tbit = this.bnst[b].mem[num].v|this.bnst[b].mem[matchlist[0]].v;
  				if(tbit==(tbit|this.bnst[b].mem[matchlist[1]].v)){
  					var bp1 = bittonum(tbit,9);
    				var bp2 = bp1+1+bittonum(tbit >> (bp1+1),8-bp1);
    				var bp3 = bp2+1+bittonum(tbit >> (bp2+1),8-bp2);
    				this.htlist.push([num,matchlist[0],matchlist[1],this.bpjtn[b][bp1],this.bpjtn[b][bp2],this.bpjtn[b][bp3]]);
  				}
  			}
  		}
  	}
  }
  
  this.findSSF = function(r,c,num){
  	var matched = false;
  	if(this.rnst[r].mem[num].can==3){
  	  var sr1,sp1,sp2,sp3;
  		for(var i=0;i < 8;i++){
  			if(this.rnst[r].mem[num].v&this.rnst[i].mem[num].v==this.rnst[r].mem[num].v&&i!=r){
  				sr1=i;
  				for(i++;i < 9;i++){
  					if(this.rnst[r].mem[num].v&this.rnst[i].mem[num].v==this.rnst[r].mem[num].v&&i!=r){
  						matched = true;
  						break;
  					}
  				}
  			}
  		}
  		if(matched){
  			sp1=bittonum(this.rnst[r].mem[num].v,9);
  			sp2=sp1+1+bittonum(this.rnst[r].mem[num].v >> (sp1+1),8-sp1);
  			sp3=sp2+1+bittonum(this.rnst[r].mem[num].v >> (sp2+1),8-sp2);
  			this.sflist.push([num,r,sr1,i-1,sp1,sp2,sp3,1]);
  		}
  	}
  	if(this.cnst[c].mem[num].can==3&&!matched){
  	  var sc1,sp1,sp2,sp3;
  		for(var i=0;i < 8;i++){
  			if(this.cnst[c].mem[num].v&this.cnst[i].mem[num].v==this.cnst[c].mem[num].v&&i!=c){
  				sc1=i;
  				for(i++;i < 9;i++){
  					if(this.cnst[c].mem[num].v&this.cnst[i].mem[num].v==this.cnst[c].mem[num].v&&i!=c){
  						matched = true;
  						break;
  					}
  				}
  			}
  		}
  		if(matched){
  			sp1=bittonum(this.cnst[c].mem[num].v,9);
  			sp2=sp1+1+bittonum(this.cnst[c].mem[num].v >> (sp1+1),8-sp1);
  			sp3=sp2+1+bittonum(this.cnst[c].mem[num].v >> (sp2+1),8-sp2);
  			this.sflist.push([num,r,sc1,i-1,sp1,sp2,sp3,2]);
  		}
  	}
  }
  
  this.findSF = function(r,c,num){
  	var matched = false;
  	var sp1,sp2,sp3;
  	if(this.rnst[r].mem[num].can==2){
  		rfor:
  		for(var i=0,ix,iy;i < 7;i++){
  			if(this.rnst[i].mem[num].can ==1) continue;
  			if(this.rnst[i].mem[num].can > 3) continue;
  			for(ix=i+1;ix < 8;ix++){
  			  if(this.rnst[ix].mem[num].can ==1) continue;
  			  if(this.rnst[ix].mem[num].can > 3) continue;
  				for(iy=ix+1;iy < 9;iy++){
  					if(this.rnst[iy].can ==1) continue;
  					matched=checktpl(this.rnst[i].mem[num].v,this.rnst[ix].mem[num].v,this.rnst[iy].mem[num].v);
            if(matched) break rfor;
  				}
  			}
  		}
  		if(matched){
  			var tbit = this.rnst[i].mem[num].v|this.rnst[ix].mem[num].v;
  			sp1 = bittonum(tbit,9);
  			sp2 = sp1+1+bittonum(tbit >> (sp1+1),8-sp1);
  			sp3 = sp2+1+bittonum(tbit >> (sp2+1),8-sp2);
  			this.sflist.push([num,i,ix,iy,sp1,sp2,sp3,1]);
  		}
  	}
  	if(this.cnst[c].mem[num].can==2){
  		matched = false;
  		cfor:
  		for(var i=0,ix,iy;i < 7;i++){
  			if(this.cnst[i].mem[num].can ==1) continue;
  			if(this.cnst[i].mem[num].can > 3) continue;
  			for(ix=i+1;ix < 8;ix++){
  			  if(this.cnst[ix].mem[num].can ==1) continue;
  			  if(this.cnst[ix].mem[num].can > 3) continue;
  				for(iy=ix+1;iy < 9;iy++){
  					if(this.cnst[iy].mem[num].can ==1) continue;
  					matched=checktpl(this.cnst[i].mem[num].v,this.cnst[ix].mem[num].v,this.cnst[iy].mem[num].v);
            if(matched) break cfor;
  				}
  			}
  		}
  		if(matched){
  			var tbit = this.cnst[i].mem[num].v|this.cnst[ix].mem[num].v;
  			sp1 = bittonum(tbit,9);
  			sp2 = sp1+1+bittonum(tbit >> (sp1+1),8-sp1);
  			sp3 = sp2+1+bittonum(tbit >> (sp2+1),8-sp2);
  			this.sflist.push([num,i,ix,iy,sp1,sp2,sp3,2]);
  		}
  	}
  }
  
  this.findYW = function(r,c,b){
  	var rs=r*9;
  	var p=rs+c;
  	if(this.cells[p].isfilled) return;
  	if(this.cells[p].can==2){
  		var temp,tbit,matched=false;
  		var cs=c;
  		var matchlist = new Array;
  		for(var i=0;i < 9;i++,rs++,cs+=9){
  			if(this.cells[rs].can==2&&matchitc(this.cells[p].v,this.cells[rs].v)) matchlist.push([this.cells[p].v&this.cells[rs].v,rs,1]);
  			if(this.cells[cs].can==2&&matchitc(this.cells[p].v,this.cells[cs].v)) matchlist.push([this.cells[p].v&this.cells[cs].v,cs,2]);
  			if(this.cells[this.bpjtn[b][i]].can==2&&matchitc(this.cells[p].v,this.cells[this.bpjtn[b][i]].v)){
  				matchlist.push([this.cells[p].v&this.cells[this.bpjtn[b][i]].v,this.bpjtn[b][i],4]);
  			}
  		}
  		for(var i=0;i < matchlist.length;){
  			temp = matchlist[i];
  			tbit = (this.cells[p].v|this.cells[temp[1]].v)&~temp[0];
  			for(var j=++i;j < matchlist.length;j++){
  				if(this.cells[matchlist[j][1]].v==tbit){
  					if(this.isrltive(temp[1],matchlist[j][1])) continue;
  					matched = true;
  					var itc = bittonum(this.cells[temp[1]].v&this.cells[matchlist[j][1]].v,9);
  					if(temp[2] == 4){
  						this.ywlist.push([itc,p,matchlist[j][1],temp[1],1]);
  					}else if(matchlist[j][2] == 4){
  						this.ywlist.push([itc,p,temp[1],matchlist[j][1],1]);
  					}else{
  						this.ywlist.push([itc,p,temp[1],matchlist[j][1],3]);
  					}
  				}
  			}
  		}
  		if(!matched){
  			for(var i=0,px,rs,cs,bn,ml;i < matchlist.length;i++){
  				ml = new Array;
  				px=matchlist[i][1];
  				cs=px%9;
  				rs=px-cs;
  				bn=this.bpstn[px];
      		tbit = (this.cells[p].v|this.cells[matchlist[i][1]].v)&~matchlist[i][0];
  				for(var j=0;j < 9;j++,rs++,cs+=9){
  						if(this.cells[rs].v==tbit) ml.push(rs);
  						if(this.cells[cs].v==tbit) ml.push(cs);
  						if(this.cells[this.bpjtn[bn][j]].v==tbit){
  				      ml.push(this.bpjtn[bn][j]);
  			      }
  				}
      		for(;ml.length > 0;){
      			temp = ml.shift();
      			if(this.isrltive(temp,p)) continue;
      			var itc = bittonum(this.cells[temp].v&this.cells[p].v,9);
      			if(matchlist[i][2]==4){
      				this.ywlist.push([itc,matchlist[i][1],temp,p,1]);
      			}else if(this.isrltive(matchlist[i][1],temp)&4){
      				this.ywlist.push([itc,matchlist[i][1],p,temp,1]);
      			}else{
      				this.ywlist.push([itc,matchlist[i][1],p,temp,3]);
      			}
      		}
  			}
  		}
  	}
  }
  
  this.solve = function(){
  	var maxi=0;
    for(var i=0;i < this.slvl;){
    	if(this.solveOrder(i)){
    		if(i > maxi) maxi=i;
    		i=0;
    	}else{
    		i++;
    	}
    }
    this.depth=maxi;
    if(this.issolved&&this.con) this.logs.push("Sudoku solved!");
    if(this.con) this.logs.push("DFS count"+this.dfscnt);
    if(this.con) this.loglogs();
  }
  
  this.solveHS = function(){
  	var temp;
  	if(this.hslist.length > 0){
  		var res=true;
  	}else{
  		return false;
  	}
  	for(;this.hslist.length > 0;){
  		temp=this.hslist.shift();
  		if(this.cells[temp[1]].isfilled) continue;
  		this.place(temp[0],temp[1]);
  		this.logs.push((temp[0]+1)+" is filled into "+idxtocod(temp[1])+" : Only place to fill in the relative "+temp[2]);
  	}
  	return res;
  }
  
  this.solveNS = function(){
  	var temp;
  	if(this.nslist.length > 0){
  		var res=true;
  	}else{
  		return false;
  	}
  	for(;this.nslist.length > 0;){
  		temp=this.nslist.shift();
  		if(this.cells[temp[1]].isfilled) continue;
  		this.place(temp[0],temp[1]);
  		this.logs.push((temp[0]+1)+" is the only candidate for cell "+idxtocod(temp[1]));
  	}
  	return res;
  }
  
  this.solveCM = function(){
  	//Claiming and pointing
  	var temp,tbit,tres;
  	if(this.claims.length > 0){
  		var res=true;
  	}else{
  		return false;
  	}
  	for(;this.claims.length > 0;){
  		temp = this.claims.shift();
  		tbit = ~temp[2];
  		switch(temp[3]){
  			case 1:
  			tres=false;
  			if(this.rnst[temp[1]].mem[temp[0]].isfilled) break;
  			if(this.rnst[temp[1]].mem[temp[0]].can == this.bnst[temp[3]].mem[temp[0]].can) break;
  			var rs = temp[1]*9;
  			for(var i=0,bit=1;i < 9;i++){
  				if((bit&tbit)&&!this.cells[rs].isfilled){
  					if(this.delcan(temp[0],rs)) tres=true;
  				}
  				rs++;
  				bit = bit << 1;
  			}
  			if(tres) this.logs.push((temp[0]+1)+" in row "+(temp[1]+1)+" is locked by one of the blocks in the row");
  			break;
  			case 2:
  			tres=false;
  			if(this.cnst[temp[1]].mem[temp[0]].isfilled) break;
  			if(this.cnst[temp[1]].mem[temp[0]].can == this.bnst[temp[3]].mem[temp[0]].can) break;
  			var cs = temp[1];
  			for(var i=0,bit=1;i < 9;i++){
  				if((bit&tbit)&&!this.cells[cs].isfilled){
  					if(this.delcan(temp[0],cs)) tres=true;
  				}
  				cs+=9;
  				bit = bit << 1;
  			}
  			if(tres) this.logs.push((temp[0]+1)+" in column "+(temp[1]+1)+" is locked by one of the blocks in the column");
  			break;
  			case 4:
  			tres=false;
  			if(this.bnst[temp[1]].mem[temp[0]].isfilled) break;
  			if(temp[2]==0007||temp[2]==0070||temp[2]==0700){
  				if(this.bnst[temp[1]].mem[temp[0]].can == this.rnst[temp[3]].mem[temp[0]].can) break;
  			}else if(this.bnst[temp[1]].mem[temp[0]].can == this.cnst[temp[3]].mem[temp[0]].can) break;
  			for(var i=0,bit=1;i < 9;i++){
  				if((bit&tbit)&&!this.cells[this.bpjtn[temp[1]][i]].isfilled){
  					if(this.delcan(temp[0],this.bpjtn[temp[1]][i])) tres=true;
  				}
  				bit = bit << 1;
  			}
  			if(tres) this.logs.push((temp[0]+1)+" in block "+(temp[1]+1)+" is locked by one of the row or column");
  			break;
  		}
  	}
  }
  
  this.solveHD = function(){
  	var temp;
  	if(this.hdlist.length == 0) return false;
  	for(;this.hdlist.length > 0;){
  		temp=this.hdlist.shift();
  		if(this.cells[temp[2]].isfilled) continue;
  		if(this.cells[temp[3]].isfilled) continue;
  		var tbit = ~((1 << temp[0])+(1 << temp[1]));
  		for(var i=0,tres=false,bit=1;i < 9;i++){
  			if(bit&tbit){
					if(this.cells[temp[2]].v&bit){
						if(this.delcan(i,temp[2])) tres=true;
					}
					if(this.cells[temp[3]].v&bit){
						if(this.delcan(i,temp[3])) tres=true;
					}
				}
				bit = bit << 1;
  		}
  		if(tres) this.logs.push("Hidden pair between "+idxtocod(temp[2])+" and "+idxtocod(temp[3])+" for "+(temp[0]+1)+" and "+(temp[1]+1));
  	}
  	return true;
  }
  
  this.solveND = function(){
  	var temp;
  	if(this.ndlist.length > 0){
  		var res=true;
  	}else{
  		return false;
  	}
  	for(;this.ndlist.length > 0;){
  		temp=this.ndlist.shift();
  		if(this.cells[temp[2]].isfilled) continue;
  		if(this.cells[temp[3]].isfilled) continue;
  		switch(temp[4]){
  			case 1:
  			var rs = temp[2]-temp[2]%9;
  			var r = rs/9;
  			if(this.rnst[r].mem[temp[0]].can==2&&this.rnst[r].mem[temp[1]].can==2) break;
  		  var tbit = (1 << (temp[2]-rs))+(1 << (temp[3]-rs));
  			for(var i=0,tres=false;i < 9;i++){
  				if((1 << i)&tbit) continue;
  				if(this.cells[rs+i].isfilled) continue;
  				if(this.delcan(temp[0],rs+i)) tres=true;
  				if(this.delcan(temp[1],rs+i)) tres=true;
  			}
  			if(tres) this.logs.push("Naked pair is found between "+idxtocod(temp[2])+" and "+idxtocod(temp[3])+" for "+(temp[0]+1)+" and "+(temp[1]+1));
  			break;
  			case 2:
  			var cs = temp[2]%9;
  			if(this.cnst[cs].mem[temp[0]].can==2&&this.cnst[cs].mem[temp[1]].can==2) break;
  		  var tbit = (1 << (temp[2]-cs)/9)+(1 << (temp[3]-cs)/9);
  			for(var i=0,tres=false;i < 9;i++,cs+=9){
  				if((1 << i)&tbit) continue;
  				if(this.cells[cs].isfilled) continue;
  				if(this.delcan(temp[0],cs)) tres=true;
  				if(this.delcan(temp[1],cs)) tres=true;
  			}
  			if(tres) this.logs.push("Naked pair is found between "+idxtocod(temp[2])+" and "+idxtocod(temp[3])+" for "+(temp[0]+1)+" and "+(temp[1]+1));
  			break;
  			case 4:
  			var b = this.bpstn[temp[2]];
  			if(this.bnst[b].mem[temp[0]].can==2&&this.bnst[b].mem[temp[1]].can==2) break;
  		  var tbit = (1 << (this.bcnpj[temp[2]]))+(1 << (this.bcnpj[temp[3]]));
  			for(var i=0,tres=false;i < 9;i++){
  				if((1 << i)&tbit) continue;
  				if(this.cells[this.bpjtn[b][i]].isfilled) continue;
  				if(this.delcan(temp[0],this.bpjtn[b][i])) tres=true;
  				if(this.delcan(temp[1],this.bpjtn[b][i])) tres=true;
  			}
  			if(tres) this.logs.push("Naked pair is found between "+idxtocod(temp[2])+" and "+idxtocod(temp[3])+" for "+(temp[0]+1)+" and "+(temp[1]+1));
  			break;
  		}
  	}
  	return res;
  }
  
  this.solveNT = function(){
  	var temp;
  	if(this.ntlist.length > 0){
  		var res=true;
  	}else{
  		return false;
  	}
  	for(;this.ntlist.length > 0;){
  		temp=this.ntlist.shift();
  		if(this.cells[temp[3]].isfilled) continue;
  		if(this.cells[temp[4]].isfilled) continue;
  		if(this.cells[temp[5]].isfilled) continue;
  		switch(temp[6]){
  			case 1:
  			var rs=temp[3]-temp[3]%9;
  			var r=rs/9;
  			if(this.rnst[r].mem[temp[0]].can < 4&&this.rnst[r].mem[temp[1]].can < 4&&this.rnst[r].mem[temp[2]].can < 4) break;
  		  var tbit = (1 << (temp[3]-rs))+(1 << (temp[4]-rs))+(1 << (temp[5]-rs));
  		  for(var i=0,tres=false;i < 9;i++,rs++){
  		  	if((1 << i)&tbit) continue;
  		  	if(this.cells[rs].isfilled) continue;
  				if(this.delcan(temp[0],rs)) tres=true;
  				if(this.delcan(temp[1],rs)) tres=true;
  				if(this.delcan(temp[2],rs)) tres=true;
  		  }
  		  if(tres) this.logs.push("Naked triple is found between "+idxtocod(temp[3])+" "+idxtocod(temp[4])+" "+idxtocod(temp[5])+" for "+(temp[0]+1)+" "+(temp[1]+1)+" "+(temp[2]+1));
  		  break;
  			case 2:
  			var cs=temp[3]%9;
  			if(this.cnst[cs].mem[temp[0]].can < 4&&this.cnst[cs].mem[temp[1]].can < 4&&this.cnst[cs].mem[temp[2]].can < 4) break;
  		  var tbit = (1 << (temp[3]-cs)/9)+(1 << (temp[4]-cs)/9)+(1 << (temp[5]-cs)/9);
  		  for(var i=0,tres=false;i < 9;i++,cs+=9){
  		  	if((1 << i)&tbit) continue;
  		  	if(this.cells[cs].isfilled) continue;
  				if(this.delcan(temp[0],cs)) tres=true;
  				if(this.delcan(temp[1],cs)) tres=true;
  				if(this.delcan(temp[2],cs)) tres=true;
  		  }
  		  if(tres) this.logs.push("Naked triple is found between "+idxtocod(temp[3])+" "+idxtocod(temp[4])+" "+idxtocod(temp[5])+" for "+(temp[0]+1)+" "+(temp[1]+1)+" "+(temp[2]+1));
  		  break;
  			case 4:
  			var b = this.bpstn[temp[3]];
  			if(this.bnst[b].mem[temp[0]].can < 4&&this.bnst[b].mem[temp[0]].can < 4&&this.bnst[b].mem[temp[0]].can < 4) break;
  		  var tbit = (1 << (this.bcnpj[temp[3]]))+(1 << (this.bcnpj[temp[4]]))+(1 << (this.bcnpj[temp[5]]));
  		  for(var i=0,tres=false;i < 9;i++){
  		  	if((1 << i)&tbit) continue;
  		  	if(this.cells[this.bpjtn[b][i]].isfilled) continue;
  				if(this.delcan(temp[0],this.bpjtn[b][i])) tres=true;
  				if(this.delcan(temp[1],this.bpjtn[b][i])) tres=true;
  				if(this.delcan(temp[2],this.bpjtn[b][i])) tres=true;
  		  }
  		  if(tres) this.logs.push("Naked triple is found between "+idxtocod(temp[3])+" "+idxtocod(temp[4])+" "+idxtocod(temp[5])+" for "+(temp[0]+1)+" "+(temp[1]+1)+" "+(temp[2]+1));
  		  break;
  		}
  	}
  }
  
  this.solveHT = function(){
  	var temp,mch;
  	if(this.htlist.length == 0) return false;
  	for(;this.htlist.length > 0;){
  		temp=this.htlist.shift();
  		mch=false;
  		if(this.cells[temp[3]].can==1) continue;
  		if(this.cells[temp[4]].can==1) continue;
  		if(this.cells[temp[5]].can==1) continue;
  		var tbit = ~((1 << temp[0])+(1 << temp[1])+(1 << temp[2]));
  		for(var i=0,bit=1;i < 9;i++){
  			if(bit&tbit){
					if(this.cells[temp[3]].v&bit){
						if(this.delcan(i,temp[3])) mch=true;
					}
					if(this.cells[temp[4]].v&bit){
						if(this.delcan(i,temp[4])) mch=true;
					}
					if(this.cells[temp[5]].v&bit){
						if(this.delcan(i,temp[5])) mch=true;
					}
				}
				bit = bit << 1;
  		}
  		if(mch) this.logs.push("Hidden triple is found between "+idxtocod(temp[3])+" "+idxtocod(temp[4])+" "+idxtocod(temp[5])+" for "+(temp[0]+1)+" "+(temp[1]+1)+" "+(temp[2]+1));
  	}
  	return true;
  }
  
  this.solveXW = function(){
  	var temp;
  	if(this.xwlist.length > 0){
  		var res=true;
  	}else{
  		return false;
  	}
  	for(;this.xwlist.length >0;){
  		temp = this.xwlist.shift();
  		if(temp[5]==1){
  			if(this.rnst[temp[1]].mem[temp[0]].isfilled) continue;
  			if(this.cnst[temp[3]].mem[temp[0]].can==2&&this.cnst[temp[4]].mem[temp[0]].can==2) continue;
  			this.logs.push("X-Wing: number "+(temp[0]+1)+", row "+(temp[1]+1)+" "+(temp[2]+1)+", column "+(temp[3]+1)+" "+(temp[4]+1));
  			var tbit=(1 << temp[1])+(1 << temp[2]);
  			for(var i=0;i < 9;i++){
  				if((1 << i)&tbit) continue;
  				this.delcan(temp[0],temp[3]+9*i);
  				this.delcan(temp[0],temp[4]+9*i);
  			}
  		}
  		if(temp[5]==2){
  			if(this.cnst[temp[1]].mem[temp[0]].isfilled) continue;
  			if(this.rnst[temp[3]].mem[temp[0]].can==2&&this.rnst[temp[4]].mem[temp[0]].can==2) continue;
  			this.logs.push("X-Wing: number "+(temp[0]+1)+", column "+(temp[1]+1)+" "+(temp[2]+1)+", row "+(temp[3]+1)+" "+(temp[4]+1));
  			var tbit=(1 << temp[1])+(1 << temp[2]);
  			for(var i=0;i < 9;i++){
  				if((1 << i)&tbit) continue;
  				this.delcan(temp[0],temp[3]*9+i);
  				this.delcan(temp[0],temp[4]*9+i);
  			}
  		}
  	}
  	return res;
  }
  
  this.solveYW = function(){
  	var temp,pos,b,posx;
  	if(this.ywlist.length == 0) return false;
  	for(;this.ywlist.length > 0;){
  		temp=this.ywlist.shift();
  		if(temp[4]==3){
  			temp[1]%9==temp[2]%9 ? pos=temp[2]-temp[2]%9+temp[3]%9 : pos=temp[3]-temp[3]%9+temp[2]%9;
  			if(this.cells[pos].v&(1 << temp[0])){
  				this.logs.push("Y-Wing: center cell "+idxtocod(temp[1])+", wing cells "+idxtocod(temp[2])+" "+idxtocod(temp[3])+", therefore delete "+(temp[0]+1)+" at "+idxtocod(pos));
  				this.delcan(temp[0],pos);
  			}
  		}else{
				b=this.bpstn[temp[2]];
				bx=this.bpstn[temp[3]];
  			for(var i=0;i < 9;i++){
  				if(this.cells[this.bpjtn[b][i]].v&(1 << temp[0])&&this.isrltive(this.bpjtn[b][i],temp[3])){
  					this.logs.push("Y-Wing: center cell "+idxtocod(temp[1])+", wing cells "+idxtocod(temp[2])+" "+idxtocod(temp[3])+", therefore delete "+(temp[0]+1)+" at "+idxtocod(this.bpjtn[b][i]));
  					this.delcan(temp[0],this.bpjtn[b][i]);
  				}
  				if(this.cells[this.bpjtn[bx][i]].v&(1 << temp[0])&&this.isrltive(this.bpjtn[bx][i],temp[2])){
  					this.logs.push("Y-Wing: center cell "+idxtocod(temp[1])+", wing cells "+idxtocod(temp[2])+" "+idxtocod(temp[3])+", therefore delete "+(temp[0]+1)+" at "+idxtocod(this.bpjtn[bx][i]));
  					this.delcan(temp[0],this.bpjtn[bx][i]);
  				}
  			}
  		}
  	}
  	return true;
  }
  
  this.solveSF = function(){
  	var temp,tres,tbit,tbitx,mchc;
  	var res=false;
  	for(;this.sflist.length >0;){
  	  temp = this.sflist.shift();
  		tbit=(1 << temp[4])+(1 << temp[5])+(1 << temp[6]);
  	  if(temp[7]==1){
  	  	tres=false;
  			if(this.rnst[temp[1]].mem[temp[0]].isfilled) continue;
  			if(this.rnst[temp[2]].mem[temp[0]].isfilled) continue;
  			if(this.rnst[temp[3]].mem[temp[0]].isfilled) continue;
  	  	for(var i=0;i < 9;i++){
  	  		if((1 << i)&tbit) continue;
  	  		if(this.delcan(temp[0],temp[4]+9*i)) tres=true;
  	  		if(this.delcan(temp[0],temp[5]+9*i)) tres=true;
  	  		if(this.delcan(temp[0],temp[6]+9*i)) tres=true;
  	  	}
  	  	if(tres) res=true;
  			if(tres) this.logs.push("Swordfish found for "+(temp[0]+1)+" in row "+(temp[1]+1)+" "+(temp[2]+1)+" "+(temp[3]+1)+" and column "+(temp[4]+1)+" "+(temp[5]+1)+" "+(temp[6]+1));
  	  }
  	  if(temp[7]==2){
  	  	tres=false;
  			if(this.cnst[temp[1]].mem[temp[0]].isfilled) continue;
  			if(this.cnst[temp[2]].mem[temp[0]].isfilled) continue;
  			if(this.cnst[temp[3]].mem[temp[0]].isfilled) continue;
  	  	for(var i=0;i < 9;i++){
  	  		if((1 << i)&tbit) continue;
  	  		if(this.delcan(temp[0],temp[4]*9+i)) tres=true;
  	  		if(this.delcan(temp[0],temp[5]*9+i)) tres=true;
  	  		if(this.delcan(temp[0],temp[6]*9+i)) tres=true;
  	  	}
  	  	if(tres) res=true;
  			if(tres) this.logs.push("Swordfish found for "+(temp[0]+1)+" in column "+(temp[1]+1)+" "+(temp[2]+1)+" "+(temp[3]+1)+" and row "+(temp[4]+1)+" "+(temp[5]+1)+" "+(temp[6]+1));
  	  }
  	}
  	return res;
  }
  
  this.solveFF = function(){
  	if(!this.isvalid) return false;
  	if(this.issolved) return false;
  	var res=false,tbit,tbitx,tbity,ffp1,ffp2,ffp3,ffp4;
  	rfor:
  	for(var i=0;i < 9;i++){
  		for(var jx=0;jx < 8;jx++){
  			if(this.rnst[jx].mem[i].can===1) continue;
  			if(this.rnst[jx].mem[i].can > 3) continue;
  			for(var jy=jx+1;jy < 9;jy++){
  				if(this.rnst[jy].mem[i].can===1) continue;
  				if(this.rnst[jy].mem[i].can > 3) continue;
  				tbit = this.rnst[jx].mem[i].v|this.rnst[jy].mem[i].v;
  				if(countcan(tbit,9)===3){
  					if(tbit===0007) continue;
  					if(tbit===0070) continue;
  					if(tbit===0700) continue;
  					for(var jz=0;jz < 9;jz++){
  						if(this.rnst[jz].mem[i].can===1) continue;
  						if(jz===jx||jz===jy) continue;
  						if((this.rnst[jz].mem[i].v&tbit)===0) continue;
  						tbitx=this.rnst[jz].mem[i].v&~tbit;
  						tbity=0;
							if(tbitx&0007) tbity+=1;
							if(tbitx&0070) tbity+=2;
							if(tbitx&0700) tbity+=4;
							switch(tbity){
								case 1:
								tbity=0007;
								break;
								case 2:
								tbity=0070;
								break;
								case 4:
								tbity=0700;
								default:
								continue rfor;
							}
							ffp1 = bittonum(tbit,9);
							ffp2 = ffp1+1+bittonum(tbit >> (ffp1+1),8-ffp1);
							ffp3 = ffp2+1+bittonum(tbit >> (ffp2+1),8-ffp2);
							ffp4 = bittonum(tbitx,9);
							var b=this.bpstn[9*jz+ffp4];
							var c=bittonum(tbit&tbity,9);
							var cs=c;
							for(var k=0;k < 9;k++,cs+=9){
								if(this.bpstn[cs]!=b) continue;
								if(k===jz||k===jx||k===jy) continue;
								if(this.delcan(i,cs)){
									res=true;
									this.logs.push("Finned swordfish: delete "+(i+1)+" in cell "+idxtocod(cs)+", row "+(jx+1)+" "+(jy+1)+" "+(jz+1)+", column "+(ffp1+1)+" "+(ffp2+1)+" "+(ffp3+1)+", fin column "+(ffp4+1));
								}
							}
							tbitx = (tbit&tbity) >> (c+1);
							if(tbitx!=0){
								c += 1+bittonum(tbitx,9);
								for(var k=0;k < 9;k++,c+=9){
  								if(this.bpstn[c]!=b) continue;
  								if(k===jz||k===jx||k===jy) continue;
  								if(this.delcan(i,c)){
  									res=true;
  									this.logs.push("Finned swordfish: delete "+(i+1)+" in cell "+idxtocod(c)+", row "+(jx+1)+" "+(jy+1)+" "+(jz+1)+", column "+(ffp1+1)+" "+(ffp2+1)+" "+(ffp3+1)+", fin column "+(ffp4+1));
  								}
  							}
							}
							if(res) return true;
  					}
  				}
  			}
  		}
  	}
  	cfor:
  	for(var i=0;i < 9;i++){
  		for(var jx=0;jx < 8;jx++){
  			if(this.cnst[jx].mem[i].can===1) continue;
  			if(this.cnst[jx].mem[i].can > 3) continue;
  			for(var jy=jx+1;jy < 9;jy++){
  				if(this.cnst[jy].mem[i].can===1) continue;
  				if(this.cnst[jy].mem[i].can > 3) continue;
  				tbit = this.cnst[jx].mem[i].v|this.cnst[jy].mem[i].v;
  				if(countcan(tbit,9)===3){
  					if(tbit===0007) continue;
  					if(tbit===0070) continue;
  					if(tbit===0700) continue;
  					for(var jz=0;jz < 9;jz++){
  						if(this.cnst[jz].mem[i].can===1) continue;
  						if(jz===jx||jz===jy) continue;
  						if((this.cnst[jz].mem[i].v&tbit)===0) continue;
  						tbitx=this.cnst[jz].mem[i].v&~tbit
  						tbity=0;
							if(tbitx&0007) tbity+=1;
							if(tbitx&0070) tbity+=2;
							if(tbitx&0700) tbity+=4;
							switch(tbity){
								case 1:
								tbity=0007;
								break;
								case 2:
								tbity=0070;
								break;
								case 4:
								tbity=0700;
								default:
								continue cfor;
							}
							ffp1 = bittonum(tbit,9);
							ffp2 = ffp1+1+bittonum(tbit >> (ffp1+1),8-ffp1);
							ffp3 = ffp2+1+bittonum(tbit >> (ffp2+1),8-ffp2);
							ffp4 = bittonum(tbitx,9);
							var b=this.bpstn[jz+9*ffp4];
							var tr=bittonum(tbit&tbity,9);
							for(var k=0,r=9*tr;k < 9;k++,r++){
								if(this.bpstn[r]!=b) continue;
								if(k===jz||k===jx||k===jy) continue;
								if(this.delcan(i,r)){
									res=true;
									this.logs.push("Finned swordfish: delete "+(i+1)+" in cell "+idxtocod(r)+", column "+(jx+1)+" "+(jy+1)+" "+(jz+1)+", row "+(ffp1+1)+" "+(ffp2+1)+" "+(ffp3+1)+", fin row "+(ffp4+1));
								}
							}
							tbitx = (tbit&tbity) >> (tr+1);
							if(tbitx!=0){
								tr += 1+bittonum(tbitx,9);
  							for(var k=0,r=9*tr;k < 9;k++,r++){
  								if(this.bpstn[r]!=b) continue;
  								if(k===jz||k===jx||k===jy) continue;
  								if(this.delcan(i,r)){
  									res=true;
  									this.logs.push("Finned swordfish: delete "+(i+1)+" in cell "+idxtocod(r)+", column "+(jx+1)+" "+(jy+1)+" "+(jz+1)+", row "+(ffp1+1)+" "+(ffp2+1)+" "+(ffp3+1)+", fin row "+(ffp4+1));
  								}
  							}
							}
							return res;
  					}
  				}
  			}
  		}
  	}
  	return false;
  }
  
  this.solveSC = function(){
  	//if there are too many bi-position choices for a number then it is very likely to be solvable by clouring method
  	//showing the clouring logic is too complicated to code therefore I used trial-and-error type mechanism
  	if(!this.isvalid) return false;
  	if(this.issolved) return false;
  	var tsdx,tsdy;
  	for(var i=0,matchr=0,matchc=0,matchb=0;i < 9;i++,matchr=0,matchc=0,matchb=0){
  		for(var j=0;j < 9;j++){
  			if(this.rnst[j].mem[i].can==2){
  				matchr++;
  				if(matchr == 1){
  					var rs=j*9;
  					var rp=bittonum(this.rnst[j].mem[i].v,9)
  				  var p1=rs+rp;
  				  var p2=rs+bittonum(this.rnst[j].mem[i].v&~(1 << rp),9);
  				}
  			}
  			if(this.cnst[j].mem[i].can==2) matchc++;
  			if(this.bnst[j].mem[i].can==2) matchb++;
  		}
  		if(matchr+matchc+matchb < 6) continue;
  		if(!matchr||!matchc||!matchb) continue;
  		tsdx = this.cpy();
  		tsdx.slvl=10;
  		tsdx.place(i,p1);
  		tsdx.solve();
  		this.dfscnt+=tsdx.dfscnt;
  		if(tsdx.isvalid){
  			if(tsdx.issolved){
  				this.init(tsdx.arr);
  				this.logs.push(idxtocod(p1)+", "+(i+1)+", sudoku solved. Fill in this number.");
  				this.logs=this.logs.concat(tsdx.logs);
  				return true;
  			}
  			tsdy = this.cpy();
  			tsdy.slvl=10;
  			tsdy.place(i,p2);
  			tsdy.solve();
  		  this.dfscnt+=tsdy.dfscnt;
  			if(tsdy.isvalid){
  				if(tsdy.issolved){
  					this.init(tsdy.arr);
  				  this.logs.push(idxtocod(p2)+", "+(i+1)+", sudoku solved. Fill in this number.");
  				  this.logs=this.logs.concat(tsdy.logs);
  					return true;
  				}else{
      			for(var j=0,deln,delp,ret=false;j < 729;j++){
      				if(this.ncache[j]&&!tsdx.ncache[j]&&!tsdy.ncache[j]){
      					delp = Math.floor(j/9);
      					deln = j%9;
      					ret = true;
      					this.logs.push("Because filling "+(i+1)+" in options "+idxtocod(p1)+" "+idxtocod(p2)+" both get "+(deln+1)+" at "+idxtocod(delp)+" deleted, it can be removed.");
      					this.delcan(deln,delp);
      				}
      			}
      			return ret;
  				}
  			}else{
  				this.logs.push(idxtocod(p2)+", "+(i+1)+", sudoku failed. Place it at "+idxtocod(p1)+" instead.");
  		    this.place(i,p1);
  		    return true;
  			}
  		}else{
  			this.logs.push(idxtocod(p1)+", "+(i+1)+", sudoku failed. Place it at "+idxtocod(p2)+" instead.");
  			this.place(i,p2);
  			return true;
  		}
  	}
  	return false;
  }
  
  this.solveST = function(){
  	//Trial and Error
  	//this solving method goes very deep therefore it's not a human-like strategy
  	//however it can be human-like if tsd.slvl is 12, but it will take longer to solve
  	if(!this.isvalid) return false;
  	if(this.issolved) return false;
  	var tsdx,tsdy;
  	var matchlist = new Array;
  	for(var i=0;i < 81;i++){
  		if(this.cells[i].can==2) matchlist.push(i);
  	}
  	for(var tryl,tnx,tny;matchlist.length > 0;){
  		tsdx = this.cpy();
  		tsdx.slvl=13;
  		tryl = matchlist.shift();
  		tnx = bittonum(tsdx.cells[tryl].v,9);
  		tny = bittonum(tsdx.cells[tryl].v&~(1 << tnx),9);
  		if(this.tcache[tryl*9+tny]&&this.tcache[tryl*9+tnx]) continue;
  		this.tcache[tryl*9+tnx]=true;
  		this.logs.push("Bi-value cell trial: try to fill "+(tnx+1)+" in "+idxtocod(tryl));
  		tsdx.place(tnx,tryl);
  		tsdx.solve();
  		this.dfscnt+=tsdx.dfscnt;
  		if(tsdx.issolved){
  			this.init(tsdx.arr);
  			this.logs.push(idxtocod(tryl)+", "+(tnx+1)+", sudoku solved. Fill in this number.");
  			this.logs=this.logs.concat(tsdx.logs);
  			return true;
  		}else if(!tsdx.isvalid){
  			this.delcan(tnx,tryl);
  			this.logs.push(idxtocod(tryl)+", "+(tnx+1)+", sudoku failed. Delete this candidate.");
  			return true;
  		}else{
  			tsdy = this.cpy();
  			tsdy.slvl=13;
  			this.tcache[tryl*9+tny]=true;
    		this.logs.push("Bi-value cell trial: try to fill "+(tny+1)+" in "+idxtocod(tryl));
    		tsdy.place(tny,tryl);
    		tsdy.solve();
    		this.dfscnt+=tsdy.dfscnt;
    		if(tsdy.issolved){
    			this.init(tsdy.arr);
    			this.logs.push(idxtocod(tryl)+", "+(tny+1)+", sudoku solved. Fill in this number.");
  				this.logs=this.logs.concat(tsdy.logs);
    			return true;
    		}else if(!tsdy.isvalid){
    			this.delcan(tny,tryl);
    			this.logs.push(idxtocod(tryl)+", "+(tny+1)+", sudoku failed. Delete this candidate.");
    			return true;
    		}else{
    			if(this.tcache[tryl*9+tny]||this.tcache[tryl*9+tnx]) continue;
    			for(var j=0,deln,delp,ret=false;j < 729;j++){
    				if(this.ncache[j]&&!tsdx.ncache[j]&&!tsdy.ncache[j]){
    					delp = Math.floor(j/9);
    					deln = j%9;
    					ret = true;
    					this.logs.push("Because by filling in both candidates at "+idxtocod(tryl)+", candidate "+(deln+1)+" at "+idxtocod(delp)+" is deleted, it can be removed.");
    					this.delcan(deln,delp);
    				}
    			}
    			if(ret) return true;
    		}
  		}
  	}
  	return false;
  }
  
  this.dfsy = function(){
  	if(!this.isvalid) return false;
  	if(this.issolved) return false;
  	var tsdx,tsdy;
  	var matchlist = new Array;
  	for(var i=0;i < 81;i++){
  		if(this.cells[i].can==3) matchlist.push(i);
  	}
  	for(var tryl,tnx;matchlist.length > 0;){
  		tsdx = this.cpy();
  		tsdx.slvl=13;
  		tryl = matchlist.shift();
  		tnx = bittonum(tsdx.cells[tryl].v,9);
  		this.logs.push("Trial and Error: "+idxtocod(tryl)+", "+(tnx+1));
  		tsdx.place(tnx,tryl);
  		tsdx.solve();
  		this.dfscnt+=tsdx.dfscnt;
  		if(tsdx.issolved){
  			this.init(tsdx.arr);
  			this.logs.push(idxtocod(tryl)+", "+(tnx+1)+", sudoku solved. Fill in this number.");
  			this.logs=this.logs.concat(tsdx.logs);
  			return true;
  		}else if(!tsdx.isvalid){
  			this.delcan(tnx,tryl);
  			this.logs.push(idxtocod(tryl)+", "+(tnx+1)+", sudoku failed. Delete this candidate.");
  			return true;
  		}else{
  			tsdy = this.cpy();
  			tsdy.delcan(tnx,tryl);
  			tsdy.slvl=13;
  			tsdy.solve();
  			this.dfscnt+=tsdy.dfscnt;
  			if(tsdy.issolved){
  				this.init(tsdy.arr);
  				this.logs=this.logs.concat(tsdy.logs);
  				return true;
  			}else if(!tsdy.isvalid){
  				this.place(tnx,tryl);
  				this.logs.push("Filling other numbers in "+idxtocod(tryl)+" all make this puzzle invalid, therefore "+(tnx+1)+" should be filled.");
  				return true;
  			}else{
    			for(var j=0,deln,delp,ret=false;j < 729;j++){
    				if(this.ncache[j]&&!tsdx.ncache[j]&&!tsdy.ncache[j]){
    					delp = Math.floor(j/9);
    					deln = j%9;
    					ret = true;
    					this.logs.push(idxtocod(delp)+", "+(deln+1)+", sudoku failed. Delete this candidate.");
    					this.delcan(deln,delp);
    				}
    			}
    			if(ret) return true;
    		}
    	}
  	}
  	return false;
  }
  
  this.solveOrder = function(i){
  	switch(i){
  		case 0:
  		//Naked Single
  		return this.solveNS();
  		case 1:
  		//Hidden Single
  		return this.solveHS();
  		case 2:
  		//Claiming, Pointing & Box-Line Reduction
  		return this.solveCM();
  		case 3:
  		//Naked Double
  		return this.solveND();
  		case 4:
  		//Hidden Double
  		return this.solveHD();
  		case 5:
  		//Naked Triple
  		return this.solveNT();
  		case 6:
  		//Hidden Triple
  		return this.solveHT();
  		case 7:
  		//X-Wing
  		return this.solveXW();
  		case 8:
  		//Swordfish
  		return this.solveSF();
  		case 9:
  		//Y-Wing
  		return this.solveYW();
  		case 10:
  		//Simple Colouring
  		return this.solveSC();
  		case 11:
  		//Finned Swordfish
  		return this.solveFF();
  		case 12:
  		//Junior Exocet
  		//The detection logic was wrong
  		//return this.solveJE();
  		//weak DFS
  		return this.solveST();
  		case 13:
  		return this.dfsy();
  		case 14:
  	}
  }
  
	this.isrltive = function(pos1,pos2){
		var res=0;
		var l=this.bpjtn.length;
		if(Math.floor(pos1/l)==Math.floor(pos2/l)) res++;
		if((pos1-pos2)%l==0) res+=2;
		if(this.bpstn[pos1]==this.bpstn[pos2]) res+=4;
		return res;
	}
  
	this.cpy = function(){
		var res = new sd9(false,false);
		for(var i=0;i < 81;i++){
			res.cells[i] = this.cells[i].cpy();
		}
	  res.arr = this.arr.concat();
	  res.ncache = this.ncache.concat();
	  res.tcache = this.tcache.concat();
	  res.isvalid = this.isvalid;
	  res.issolved = this.issolved;
    res.d_or_t = this.d_or_t;
    res.tstat = this.tstat;
    res.depth = this.depth+1;
    res.dfscnt = 1;
    for(var i=0;i < 9;i++){
    	res.rnst[i] = this.rnst[i].cpy();
    	res.cnst[i] = this.cnst[i].cpy();
    	res.bnst[i] = this.bnst[i].cpy();
    }
    return res;
	}
	
	this.loglogs = function(){
		for(;this.logs.length > 0;){
			console.log(this.logs.shift());
		}
	}
	
}

function autofill(arr,obj,arg1,arg2){
	for(var i=0;i < arr.length;i++){
		arr[i] = new obj(arg1,arg2);
	}
}

function bittonum(bit,l){
	for(var i=0;i < l;i++){
		if(bit&(1 << i)) return i;
	}
}

function countcan(bit,l){
	var count=0;
	for(var i=0;i < l;i++){
		if(bit&(1 << i)) count++;
	}
	return count;
}

function checktpl(bitx,bity,bitz){
	var fbit = bitx|bity;
	if(countcan(fbit,9) != 3) return false;
	var sbit = bity|bitz;
	var tbit = bitx|bitz;
	if((fbit==sbit)&&(sbit==tbit)) return true;
	return false;
}

function indxtorc(indx,l){
	var c = indx%l;
	var r = (indx-c)/l;
	return "R"+r+"C"+c;
}

function matchitc(bitx,bity){
	if(countcan(bitx|bity,9)==3&&countcan(bitx&bity,9)==1) return true;
	return false;
}

function verijexc(cx,cy,cz,ib){
	var fc=0;
	var rbit;
	if(cx.can===1) fc++;
	if(cy.can===1) fc++;
	if(cz.can===1) fc++;
	if(fc != 1) return 0;
	var bitx = (cx.v|cy.v)&~ib;
	var bity = (cz.v|cy.v)&~ib;
	var bitz = (cx.v|cz.v)&~ib;
	if(cx.can===1) rbit=bity;
	if(cy.can===1) rbit=bitz;
	if(cz.can===1) rbit=bitx;
	var cnt = countcan(rbit,9);
	if(cnt > 2&&cnt < 5) return rbit;
	return 0;
}

function idxtocod(idx){
	var r,c;
	c=idx%9;
	r=(idx-c)/9;
	c++;r++;
	return "R"+r+"C"+c;
}
